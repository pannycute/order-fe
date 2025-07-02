import React, { useEffect, useMemo, useCallback } from "react";
import { Button, Text } from "@nextui-org/react";
import { Flex } from "../styles/flex";
import { TableWrapper, type Column } from "../table/table";
import { useToast } from "../toast/ToastProvider";
import { usePaymentConfirmationStore } from "../../stores/paymentConfirmationsStore";
import { Eye, HouseIcon, CreditCard } from "lucide-react";
import { Breadcrumbs, Crumb, CrumbLink } from "../breadcrumb/breadcrumb.styled";

export const PaymentConfirmations = () => {
  const {
    data,
    loading,
    error,
    totalData,
    page,
    limit,
    loadAll,
  } = usePaymentConfirmationStore();

  const { showToast } = useToast();

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
    if (error) {
      showToast(error, "error");
    }
  }, [error]);

  const columns: Column[] = useMemo(
    () => [
      { name: "ID", uid: "confirmation_id", sortable: true },
      { name: "ORDER ID", uid: "order_id", sortable: true },
      { name: "PRODUCT ID", uid: "product_id", sortable: true },
      { name: "QUANTITY", uid: "quantity", sortable: true },
      { name: "UNIT PRICE", uid: "unit_price", sortable: true },
      { name: "SUBTOTAL", uid: "subtotal", sortable: true },
    ],
    []
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
        showSorting={true}
      />
    </Flex>
  );
};
