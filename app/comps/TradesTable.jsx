// components/TradesTable.js
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowForward,
  ArrowBack,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Schedule,
  BarChart,
} from "@mui/icons-material";

export default function TradesTable({ trades }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const theme = useTheme();
  const columnsToShow = [
    { key: "Timestamp", icon: <Schedule /> },
    { key: "B/S", icon: null },
    { key: "Type", icon: null },
    { key: "Filled Qty", icon: <AttachMoney /> },
    { key: "Avg Fill Price", icon: <AttachMoney /> },
    { key: "Profit/Loss", icon: <BarChart /> },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPage(
        (prevPage) => (prevPage + 1) % Math.ceil(trades.length / rowsPerPage)
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [trades.length, rowsPerPage]);

  if (!trades.length)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          backgroundColor: theme.palette.background.default,
          borderRadius: "20px",
          boxShadow: theme.shadows[3],
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No trades available.
        </Typography>
      </Box>
    );

  const handleChangePage = (direction) => {
    setPage((prevPage) => {
      const newPage = prevPage + direction;
      const maxPage = Math.ceil(trades.length / rowsPerPage) - 1;
      return Math.max(0, Math.min(newPage, maxPage));
    });
  };

  const calculateProfitLoss = (trade) => {
    // This is a placeholder calculation. Adjust according to your actual data structure and calculation method.
    const isBuy = trade.Type === "BUY";
    const quantity = parseFloat(trade["Filled Qty"]);
    const price = parseFloat(trade["Avg Fill Price"]);

    // Assuming you have a reference price to calculate profit/loss against
    const referencePriceField = isBuy ? "Current Price" : "Avg Fill Price";
    const referencePrice = parseFloat(trade[referencePriceField] || price);

    const profitLoss = isBuy
      ? (referencePrice - price) * quantity
      : (price - referencePrice) * quantity;

    return profitLoss.toFixed(2);
  };

  return (
    <Paper
      elevation={6}
      sx={{
        width: "100%",
        overflow: "hidden",
        background: theme.palette.background.paper,
        borderRadius: "20px",
        boxShadow: theme.shadows[10],
      }}
    >
      <Box p={4}>
        <Typography variant="h4" fontWeight="bold" color="primary" mb={3}>
          Detailed Trade History
        </Typography>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                {columnsToShow.map((column) => (
                  <TableCell key={column.key}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="secondary"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      {column.icon}
                      {column.key}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence mode="wait">
                {trades
                  .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                  .map((trade, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {columnsToShow.map((column) => (
                        <TableCell key={column.key}>
                          <Tooltip
                            title={`${column.key}: ${
                              column.key === "Profit/Loss"
                                ? calculateProfitLoss(trade)
                                : trade[column.key]
                            }`}
                            placement="top"
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                          >
                            <Chip
                              label={
                                column.key === "Profit/Loss"
                                  ? calculateProfitLoss(trade)
                                  : trade[column.key]
                              }
                              color={
                                column.key === "Type"
                                  ? trade[column.key] === "BUY"
                                    ? "info"
                                    : "error"
                                  : column.key === "Profit/Loss"
                                  ? parseFloat(calculateProfitLoss(trade)) >= 0
                                    ? "success"
                                    : "error"
                                  : "default"
                              }
                              variant={
                                column.key === "Type" ||
                                column.key === "Profit/Loss"
                                  ? "filled"
                                  : "outlined"
                              }
                              size="medium"
                              icon={
                                column.key === "Profit/Loss" ? (
                                  parseFloat(calculateProfitLoss(trade)) >=
                                  0 ? (
                                    <TrendingUp />
                                  ) : (
                                    <TrendingDown />
                                  )
                                ) : null
                              }
                              sx={{
                                width: "100%",
                                justifyContent: "flex-start",
                                height: "auto",
                                fontWeight: "bold",
                                "& .MuiChip-label": {
                                  display: "block",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                },
                              }}
                            />
                          </Tooltip>
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        bgcolor={theme.palette.background.default}
      >
        <Typography variant="body2" color="text.secondary">
          Showing {page * rowsPerPage + 1} to{" "}
          {Math.min((page + 1) * rowsPerPage, trades.length)} of {trades.length}{" "}
          trades
        </Typography>
        <Box>
          <IconButton
            onClick={() => handleChangePage(-1)}
            disabled={page === 0}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": { bgcolor: theme.palette.primary.dark },
              "&:disabled": {
                bgcolor: theme.palette.action.disabledBackground,
              },
              mr: 1,
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="body1"
            sx={{ display: "inline-block", mx: 2, fontWeight: "bold" }}
          >
            Page {page + 1} of {Math.ceil(trades.length / rowsPerPage)}
          </Typography>
          <IconButton
            onClick={() => handleChangePage(1)}
            disabled={page >= Math.ceil(trades.length / rowsPerPage) - 1}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": { bgcolor: theme.palette.primary.dark },
              "&:disabled": {
                bgcolor: theme.palette.action.disabledBackground,
              },
              ml: 1,
            }}
          >
            <ArrowForward />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}
