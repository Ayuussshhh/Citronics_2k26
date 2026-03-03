import { getServerSession } from 'next-auth/next'
import nextAuthConfig from 'src/lib/nextAuthConfig'
import paymentService from 'src/services/payment-service'
import { enqueueTicketEmails } from 'src/services/email-service'

/**
 * POST /api/email/send-tickets
 *
 * Manually trigger sending ticket emails for a specific order or user.
 * Useful for re-sending tickets if the automatic email failed.
 *
 * Auth: Required. Users can only re-send to themselves.
 *       Admins/organizers can re-send for any user.
 *
 * Body: { orderId } — Re-send tickets for a specific order
 *
 * Response: { success, message, ticketCount }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])

    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    // ── Authentication ──────────────────────────────────────────────────
    const session = await getServerSession(req, res, nextAuthConfig)
    if (!session?.user?.id) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    const { orderId } = req.body

    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ success: false, message: 'orderId is required' })
    }

    // Sanitize
    const sanitizedOrderId = orderId.replace(/[^a-zA-Z0-9\-_]/g, '')
    if (sanitizedOrderId !== orderId || orderId.length > 50) {
      return res.status(400).json({ success: false, message: 'Invalid orderId format' })
    }

    // Get payment status to find tickets
    const result = await paymentService.verifyAndProcessPayment(sanitizedOrderId)

    if (result.status !== 'success' || !result.tickets || result.tickets.length === 0) {
      return res.status(400).json({
        success: false,
        message: result.status === 'success'
          ? 'No tickets found for this order'
          : `Cannot send tickets — payment status: ${result.status}`
      })
    }

    // Authorization: Ensure the tickets belong to this user (or user is admin)
    const ELEVATED_ROLES = ['admin', 'organizer', 'owner', 'head']
    const sessionRole = (session.user.role || '').toLowerCase()
    const ticketEmail = result.tickets[0]?.attendeeEmail
    const sessionEmail = session.user.email

    if (!ELEVATED_ROLES.includes(sessionRole) && ticketEmail !== sessionEmail) {
      return res.status(403).json({ success: false, message: 'Forbidden — you can only re-send your own tickets' })
    }

    // Enqueue the ticket emails (non-blocking)
    await enqueueTicketEmails(result.tickets, sanitizedOrderId)

    return res.status(200).json({
      success: true,
      message: `Ticket email${result.tickets.length > 1 ? 's' : ''} queued for delivery`,
      ticketCount: result.tickets.length
    })
  } catch (error) {
    console.error('[POST /api/email/send-tickets]', error)

    return res.status(500).json({ success: false, message: 'Failed to queue ticket emails' })
  }
}
