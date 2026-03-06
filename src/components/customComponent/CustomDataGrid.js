/**
 * CustomDataGrid — Reusable data table component (MUI Table implementation)
 * Desktop: MUI Table with search toolbar and client/server pagination
 * Mobile:  Card-per-row responsive view with search
 *
 * Single source of truth for all tabular data in the application.
 * Columns: { field, headerName, flex?, minWidth?, renderCell?, sortable? }
 */
import { useState, useCallback, useMemo } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableSortLabel from '@mui/material/TableSortLabel'
import CustomTextField from 'src/components/mui/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Pagination from '@mui/material/Pagination'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { useTheme, alpha } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Icon from 'src/components/Icon'

/* ── Desktop Toolbar ── */
function DesktopToolbar({ searchValue, onSearch }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: 2.5,
        py: 1.5,
        borderBottom: t => `1px solid ${t.palette.divider}`
      }}
    >
      <CustomTextField
        size='small'
        value={searchValue}
        onChange={e => onSearch(e.target.value)}
        placeholder='Search…'
        sx={{ minWidth: 220, maxWidth: 320 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Icon icon='tabler:search' fontSize={18} />
            </InputAdornment>
          ),
          endAdornment: searchValue ? (
            <InputAdornment position='end'>
              <IconButton size='small' onClick={() => onSearch('')} edge='end'>
                <Icon icon='tabler:x' fontSize={16} />
              </IconButton>
            </InputAdornment>
          ) : null
        }}
      />
    </Box>
  )
}

/* ── Mobile Search Bar ── */
function MobileSearchBar({ value, onChange }) {
  return (
    <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
      <CustomTextField
        fullWidth
        size='small'
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder='Search…'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Icon icon='tabler:search' fontSize={18} />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position='end'>
              <IconButton size='small' onClick={() => onChange('')} edge='end'>
                <Icon icon='tabler:x' fontSize={16} />
              </IconButton>
            </InputAdornment>
          ) : null
        }}
      />
    </Box>
  )
}

/* ── Mobile Card Row ── */
function MobileCard({ row, columns, theme, onClick }) {
  const actionCol = columns.find(c => c.field === 'actions')
  const dataCols = columns.filter(c => c.headerName && c.field !== 'actions')

  return (
    <Card
      variant='outlined'
      onClick={onClick}
      sx={{
        mb: 1.5,
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: 2,
        transition: 'all 0.15s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: theme.shadows[2]
        }
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {dataCols.map((col, i) => (
          <Box
            key={col.field}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 0.75,
              ...(i < dataCols.length - 1 && {
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`
              })
            }}
          >
            <Typography
              variant='caption'
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                fontSize: '0.68rem',
                flexShrink: 0,
                minWidth: 80
              }}
            >
              {col.headerName}
            </Typography>
            <Box sx={{ textAlign: 'right', ml: 2, minWidth: 0, flex: 1 }}>
              {col.renderCell
                ? col.renderCell({ row, value: row[col.field] })
                : (
                  <Typography variant='body2' noWrap>
                    {row[col.field] ?? '—'}
                  </Typography>
                )}
            </Box>
          </Box>
        ))}

        {actionCol?.renderCell && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              pt: 1,
              mt: 0.5,
              borderTop: `1px solid ${theme.palette.divider}`
            }}
            onClick={e => e.stopPropagation()}
          >
            {actionCol.renderCell({ row, value: null })}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

/* ── Main Component ── */
const CustomDataGrid = ({
  rows = [],
  columns = [],
  loading = false,
  paginationModel = { page: 0, pageSize: 10 },
  onPaginationModelChange,
  pageSizeOptions = [10, 25, 50],
  paginationMode = 'server',
  rowCount = 0,
  disableRowSelectionOnClick = true,
  showToolbar = true,
  emptyText = 'No records found.',
  onRowClick,
  getRowId = (row) => row.id,
  sx = {},
  ...otherProps
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileSearch, setMobileSearch] = useState('')
  const [desktopSearch, setDesktopSearch] = useState('')
  const [sortField, setSortField] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const handleMobileSearch = useCallback((val) => {
    setMobileSearch(val)
    onPaginationModelChange?.({ ...paginationModel, page: 0 })
  }, [onPaginationModelChange, paginationModel])

  const handleDesktopSearch = useCallback((val) => {
    setDesktopSearch(val)
    onPaginationModelChange?.({ ...paginationModel, page: 0 })
  }, [onPaginationModelChange, paginationModel])

  const handleSort = useCallback((field) => {
    setSortDir(prev => (sortField === field && prev === 'asc' ? 'desc' : 'asc'))
    setSortField(field)
  }, [sortField])

  const filteredRows = useCallback(() => {
    if (!isMobile || !mobileSearch) return rows

    const term = mobileSearch.toLowerCase()

    return rows.filter(row =>
      columns.some(col => {
        const v = row[col.field]

        return v != null && String(v).toLowerCase().includes(term)
      })
    )
  }, [isMobile, mobileSearch, rows, columns])

  /* ── Desktop computed rows ── */
  const desktopRows = useMemo(() => {
    let result = rows

    if (paginationMode === 'client' && desktopSearch) {
      const term = desktopSearch.toLowerCase()
      result = result.filter(row =>
        columns.some(col => {
          const v = row[col.field]

          return v != null && String(v).toLowerCase().includes(term)
        })
      )
    }

    if (sortField) {
      result = [...result].sort((a, b) => {
        const av = a[sortField], bv = b[sortField]
        if (av == null && bv == null) return 0
        if (av == null) return 1
        if (bv == null) return -1
        const cmp = typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv))

        return sortDir === 'asc' ? cmp : -cmp
      })
    }

    if (paginationMode === 'client') {
      const { page, pageSize } = paginationModel
      result = result.slice(page * pageSize, (page + 1) * pageSize)
    }

    return result
  }, [rows, paginationMode, desktopSearch, sortField, sortDir, paginationModel, columns])

  /* ── Desktop View ── */
  if (!isMobile) {
    const clientTotal = paginationMode === 'client'
      ? (desktopSearch
          ? rows.filter(row => columns.some(col => { const v = row[col.field]; return v != null && String(v).toLowerCase().includes(desktopSearch.toLowerCase()) })).length
          : rows.length)
      : rowCount
    const totalPages = Math.max(1, Math.ceil(clientTotal / paginationModel.pageSize))

    return (
      <Box sx={sx}>
        {showToolbar && (
          <DesktopToolbar searchValue={desktopSearch} onSearch={handleDesktopSearch} />
        )}
        <TableContainer>
          <Table size='small'>
            <TableHead>
              <TableRow>
                {columns.map(col => (
                  <TableCell
                    key={col.field}
                    sx={{
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      fontSize: '0.72rem',
                      letterSpacing: '0.5px',
                      color: 'text.secondary',
                      bgcolor: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.6)
                        : theme.palette.grey[50],
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      whiteSpace: 'nowrap',
                      minWidth: col.minWidth,
                      width: col.width
                    }}
                  >
                    {col.sortable !== false && col.headerName ? (
                      <TableSortLabel
                        active={sortField === col.field}
                        direction={sortField === col.field ? sortDir : 'asc'}
                        onClick={() => handleSort(col.field)}
                      >
                        {col.headerName}
                      </TableSortLabel>
                    ) : (
                      col.headerName ?? ''
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: paginationModel.pageSize > 5 ? 5 : paginationModel.pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map(col => (
                      <TableCell key={col.field}>
                        <Skeleton variant='text' width='80%' />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : desktopRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align='center' sx={{ py: 8 }}>
                    <Icon icon='tabler:database-off' fontSize={40} style={{ color: theme.palette.text.disabled }} />
                    <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                      {emptyText}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                desktopRows.map((row, idx) => {
                  const rowId = typeof getRowId === 'function' ? getRowId(row) : (row.id ?? idx)

                  return (
                    <TableRow
                      key={rowId}
                      hover
                      onClick={onRowClick && !disableRowSelectionOnClick ? () => onRowClick({ row }) : undefined}
                      sx={{
                        cursor: onRowClick ? 'pointer' : 'default',
                        '&:last-child td': { borderBottom: 'none' }
                      }}
                    >
                      {columns.map(col => (
                        <TableCell
                          key={col.field}
                          sx={{
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                            fontSize: '0.875rem',
                            py: 1.5
                          }}
                        >
                          {col.renderCell
                            ? col.renderCell({ row, value: row[col.field] })
                            : (row[col.field] ?? '—')}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {!loading && clientTotal > 0 && (
          <Stack spacing={1.5} alignItems='center' sx={{ py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Pagination
              count={totalPages}
              page={paginationModel.page + 1}
              onChange={(_, p) => onPaginationModelChange?.({ ...paginationModel, page: p - 1 })}
              color='primary'
              size='small'
              showFirstButton
              showLastButton
            />
            <Stack direction='row' alignItems='center' spacing={1}>
              <Typography variant='caption' color='text.secondary'>Rows per page:</Typography>
              <select
                value={paginationModel.pageSize}
                onChange={e => onPaginationModelChange?.({ page: 0, pageSize: Number(e.target.value) })}
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: `1px solid ${theme.palette.divider}`,
                  background: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {pageSizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Stack>
          </Stack>
        )}
      </Box>
    )
  }

  /* ── Mobile View ── */
  const isServerMode = paginationMode === 'server'
  const visibleRows = filteredRows()

  const totalCount = isServerMode ? rowCount : visibleRows.length
  const totalPages = Math.max(1, Math.ceil(totalCount / paginationModel.pageSize))
  const safePage = Math.min(paginationModel.page, Math.max(0, totalPages - 1))

  const pagedRows = isServerMode
    ? visibleRows
    : visibleRows.slice(
        safePage * paginationModel.pageSize,
        (safePage + 1) * paginationModel.pageSize
      )

  return (
    <Box>
      {showToolbar && !isServerMode && <MobileSearchBar value={mobileSearch} onChange={handleMobileSearch} />}

      <Box sx={{ px: 2, pb: 2 }}>
        {/* Loading */}
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              variant='rectangular'
              height={100}
              sx={{ mb: 1.5, borderRadius: 2 }}
            />
          ))
        ) : pagedRows.length === 0 ? (
          /* Empty */
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Icon icon='tabler:database-off' fontSize={40} style={{ color: theme.palette.text.disabled }} />
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              {emptyText}
            </Typography>
          </Box>
        ) : (
          /* Cards */
          pagedRows.map((row, idx) => {
            const rowId = typeof getRowId === 'function' ? getRowId(row) : (row.id ?? idx)
            return (
              <MobileCard
                key={rowId}
                row={row}
                columns={columns}
                theme={theme}
                onClick={onRowClick ? () => onRowClick({ row }) : undefined}
              />
            )
          })
        )}

        {/* Pagination */}
        {!loading && totalCount > 0 && (
          <Stack spacing={1.5} alignItems='center' sx={{ mt: 2 }}>
            <Pagination
              count={totalPages}
              page={safePage + 1}
              onChange={(_, p) => onPaginationModelChange?.({ ...paginationModel, page: p - 1 })}
              color='primary'
              size='small'
              showFirstButton
              showLastButton
            />
            <Stack direction='row' alignItems='center' spacing={1}>
              <Typography variant='caption' color='text.secondary'>
                Rows per page:
              </Typography>
              <select
                value={paginationModel.pageSize}
                onChange={e =>
                  onPaginationModelChange?.({ page: 0, pageSize: Number(e.target.value) })
                }
                style={{
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: `1px solid ${theme.palette.divider}`,
                  background: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {pageSizeOptions.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Stack>
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default CustomDataGrid