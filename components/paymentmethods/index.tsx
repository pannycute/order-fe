// @/components/paymentmethods/index.tsx
import { Button, Text } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useMemo, useCallback } from "react";
import { Flex } from "../styles/flex";
import { TableWrapper, type Column } from "../table/table";
import AddEditPaymentMethodForm from "./AddEditForm.tsx";
import { useToast } from "../toast/ToastProvider";
import { useConfirmationToast } from "../toast/ConfirmationToast";
import { Edit, Trash2, Eye, HouseIcon, CreditCard } from "lucide-react";
import { Breadcrumbs, Crumb, CrumbLink } from "../breadcrumb/breadcrumb.styled";
import { usePaymentMethodStore } from "../../stores/paymentmethodStore";

export const PaymentMethods = () => {
  const {
    data,
    loading,
    error,
    totalData,
    page,
    limit,
    loadAll,
    deleteOne,
  } = usePaymentMethodStore();

  const { showToast } = useToast();
  const { showToast: showConfirmationToast } = useConfirmationToast();

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

  const handleDelete = useCallback((paymentMethod: any) => {
    showConfirmationToast(
      `Are you sure you want to delete payment method "${paymentMethod.method_name}"? This action cannot be undone.`,
      "error",
      {
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
        onConfirm: async () => {
          await deleteOne(paymentMethod.payment_method_id);
          showToast("Success delete payment method", "success");
        },
        onCancel: () => {
          console.log("Penghapusan dibatalkan");
        },
      }
    );
  }, [showConfirmationToast, deleteOne, showToast]);

  const columns: Column[] = useMemo(
    () => [
      {
        name: "METHOD NAME",
        uid: "method_name",
        sortable: true,
        render: (row) => <>{row.method_name}</>
      },
      {
        name: "DETAILS",
        uid: "details",
        sortable: false,
        render: (row) => <>{row.details}</>
      },
      {
        name: "ACTIONS",
        uid: "action",
        sortable: false,
        render: (paymentMethod: any) => (
          <div style={{ display: "flex", gap: 8 }}>
            <AddEditPaymentMethodForm
              initialData={paymentMethod}
              buttonLabel={<Edit size={16} />}
            />
            <Button
              size="md"
              color="error"
              auto
              aria-label={`Delete ${paymentMethod.payment_method_id}`}
              onClick={() => handleDelete(paymentMethod)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ),
      },
    ],
    [handleDelete]
  );

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

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
          <Link href={"/"}>
            <CrumbLink href="#">Home</CrumbLink>
          </Link>
          <Text>/</Text>
        </Crumb>
        <Crumb>
          <CreditCard />
          <CrumbLink href="#">Payment Methods</CrumbLink>
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
        <Text h3>All Payment Methods</Text>
        <Flex direction={"row"} css={{ gap: "$6" }} wrap={"wrap"}>
          <AddEditPaymentMethodForm />
        </Flex>
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
        defaultSortField="payment_method_id"
        defaultSortDirection="asc"
        ariaLabel="Payment methods management table"
        showLimitSelector={true}
        showPagination={true}
        showSorting={false}
      />
    </Flex>
  );
};