import React, { useEffect, useMemo, useCallback, useState } from "react";
import { Button, Text, Badge } from "@nextui-org/react";
import { Flex } from "../styles/flex";
import { TableWrapper, type Column } from "../table/table";
import { useToast } from "../toast/ToastProvider";
import { usePaymentConfirmationStore } from "../../stores/paymentConfirmationsStore";
import { Eye, HouseIcon, CreditCard, CheckCircle, XCircle } from "lucide-react";
import { Breadcrumbs, Crumb, CrumbLink } from "../breadcrumb/breadcrumb.styled";
import { PaymentDetailModal } from "./PaymentDetailModal";
import { PaymentConfirmation } from "../../types";

export const PaymentConfirmations = () => {
  const {
    data,
    loading,
    error,
    totalData,
    page,
    limit,
    loadAll,
    confirmPayment,
    rejectPayment,
  } = usePaymentConfirmationStore();

  const { showToast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState<PaymentConfirmation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoadData = useCallback(
    (params: {
      page: number;
      limit: number;
      sortField?: string | null;
      sortDirection?: string;
    }) => {
      loadAll(params.page, params.limit);
    },
    [loadAll]
  );

  useEffect(() => {
    // Load data when component mounts
    loadAll(page, limit);
  }, [loadAll, page, limit]);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

  const handleViewDetail = useCallback((payment: PaymentConfirmation) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  }, []);

  const handleConfirmPayment = useCallback(async (id: number) => {
    try {
      await confirmPayment(id);
      showToast("Payment confirmed successfully!", "success");
      setIsModalOpen(false);
      setSelectedPayment(null);
    } catch (error) {
      // Error will be handled by store
    }
  }, [confirmPayment, showToast]);

  const handleRejectPayment = useCallback(async (id: number) => {
    try {
      await rejectPayment(id);
      showToast("Payment rejected successfully!", "success");
      setIsModalOpen(false);
      setSelectedPayment(null);
    } catch (error) {
      // Error will be handled by store
    }
  }, [rejectPayment, showToast]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  }, []);

  const columns: Column[] = useMemo(
    () => [
      { name: "ID", uid: "confirmation_id", sortable: true },
      { name: "ORDER ID", uid: "order_id", sortable: true },
      { name: "USER ID", uid: "user_id", sortable: true, render: (item) => <Text>{item.order.user_id}</Text> },
      { 
        name: "AMOUNT", 
        uid: "amount", 
        sortable: true,
        render: (item: PaymentConfirmation) => (
          <Text>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(item.amount)}
          </Text>
        )
      },
      { name: "PAYMENT METHOD ID", uid: "payment_method_id", sortable: true },
      { 
        name: "CONFIRMATION DATE", 
        uid: "confirmation_date", 
        sortable: true,
        render: (item: PaymentConfirmation) => (
          <Text>
            {new Date(item.confirmation_date).toLocaleDateString("id-ID")}
          </Text>
        )
      },
      { 
        name: "STATUS", 
        uid: "status", 
        sortable: true,
        render: (item: PaymentConfirmation) => {
          const getStatusColor = (status: string) => {
            switch (status) {
              case "confirmed":
                return "success";
              case "rejected":
                return "error";
              case "pending":
                return "warning";
              default:
                return "default";
            }
          };

          const getStatusText = (status: string) => {
            switch (status) {
              case "confirmed":
                return "Confirmed";
              case "rejected":
                return "Rejected";
              case "pending":
                return "Pending";
              default:
                return status;
            }
          };

          return (
            <Badge color={getStatusColor(item.status) as any}>
              {getStatusText(item.status)}
            </Badge>
          );
        }
      },
      {
        name: "ACTIONS",
        uid: "actions",
        render: (item: PaymentConfirmation) => (
          <Flex css={{ gap: "$3" }}>
            <Button
              auto
              light
              icon={<Eye size={16} />}
              onPress={() => handleViewDetail(item)}
            >
              View
            </Button>
            {item.status === "pending" && (
              <>
                <Button
                  auto
                  color="success"
                  icon={<CheckCircle size={16} />}
                  onPress={() => handleConfirmPayment(item.confirmation_id)}
                  disabled={loading}
                >
                  Confirm
                </Button>
                <Button
                  auto
                  color="error"
                  icon={<XCircle size={16} />}
                  onPress={() => handleRejectPayment(item.confirmation_id)}
                  disabled={loading}
                >
                  Reject
                </Button>
              </>
            )}
          </Flex>
        ),
      },
    ],
    [handleViewDetail, handleConfirmPayment, handleRejectPayment, loading]
  );

  return (
    <Flex
      css={{
        mt: "$5",
        px: "$6",
        "@sm": {
          mt: "$10",
          px: "$16",
        },
      }}
      justify={"center"}
      direction={"column"}
    >
      <Breadcrumbs>
        <Crumb>
          <HouseIcon />
          <CrumbLink href="/">Home</CrumbLink>
          <Text>/</Text>
        </Crumb>
        <Crumb>
          <CreditCard />
          <CrumbLink href="#">Payment Confirmations</CrumbLink>
          <Text>/</Text>
        </Crumb>
        <Crumb>
          <CrumbLink href="#">List</CrumbLink>
        </Crumb>
      </Breadcrumbs>

      <Flex
        css={{
          gap: "$8",
        }}
        align={"center"}
        justify={"between"}
        wrap={"wrap"}
      >
        <Text h3>Payment Confirmations</Text>
      </Flex>

      <TableWrapper
        columns={columns}
        data={data}
        loading={loading}
        totalItems={totalData}
        onDataChange={handleLoadData}
        limitOptions={[5, 10, 15, 25]}
        defaultLimit={limit}
        defaultPage={page}
        defaultSortField="confirmation_id"
        defaultSortDirection="asc"
        ariaLabel="Payment confirmations table"
        showLimitSelector={true}
        showPagination={true}
        showSorting={false}
      />

      {/* Payment Detail Modal */}
      {isModalOpen && (
        <PaymentDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          payment={selectedPayment}
          onConfirm={handleConfirmPayment}
          onReject={handleRejectPayment}
          loading={loading}
        />
      )}
    </Flex>
  );
};
