// /components/orderitems/index.tsx
import { Button, Text } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useMemo, useCallback } from "react";
import { Flex } from "../styles/flex";
import { TableWrapper, type Column } from "../table/table";
import AddEditOrderItemForm from "./AddEditForm";
import { useToast } from "../toast/ToastProvider";
import { useConfirmationToast } from "../toast/ConfirmationToast";
import { Edit, Trash2, Eye, HouseIcon, ShoppingCartIcon } from "lucide-react";
import { Breadcrumbs, Crumb, CrumbLink } from "../breadcrumb/breadcrumb.styled";
import { useOrderItemStore } from "../../stores/orderItemStore";

export const OrderItems = () => {
  const {
    data,
    loading,
    error,
    totalData,
    page,
    limit,
    loadAll,
    deleteOne,
  } = useOrderItemStore();

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

  const handleDelete = (orderItem: any) => {
    showConfirmationToast(
      `Are you sure you want to delete order item "${orderItem.order_item_id}"? This action cannot be undone.`,
      "error",
      {
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
        onConfirm: async () => {
          await deleteOne(orderItem.order_item_id);
          showToast("Success delete order item", "success");
        },
        onCancel: () => {
          console.log("Penghapusan dibatalkan");
        },
      }
    );
  };

  const columns: Column[] = useMemo(
    () => [
      {
        name: "ORDER ITEM ID",
        uid: "order_item_id",
        sortable: true,
        render: (item: any) => item.order_item_id ?? "-",
      },
      {
        name: "ORDER ID",
        uid: "order_id",
        sortable: true,
        render: (item: any) => item.order_id ?? "-",
      },
      {
        name: "PRODUCT ID",
        uid: "product_id",
        sortable: true,
        render: (item: any) => item.product_id ?? "-",
      },
      {
        name: "QUANTITY",
        uid: "quantity",
        sortable: true,
        render: (item: any) => item.quantity ?? "-",
      },
      {
        name: "UNIT PRICE",
        uid: "unit_price",
        sortable: true,
        render: (item: any) =>
          item.unit_price?.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          }) ?? "-",
      },
      {
        name: "SUBTOTAL",
        uid: "subtotal",
        sortable: true,
        render: (item: any) =>
          item.subtotal?.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          }) ?? "-",
      },
      {
        name: "ACTIONS",
        uid: "action",
        sortable: false,
        render: (item: any) => (
          <div style={{ display: "flex", gap: 8 }}>
            <AddEditOrderItemForm
              initialData={item}
              buttonLabel={<Edit size={16} />}
            />
            <Button
              size="md"
              color="error"
              auto
              aria-label={`Delete ${item.order_item_id}`}
              onClick={() => handleDelete(item)}
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
    console.log("DATA:", data);
    if (error) {
      showToast(error, "error");
    }
  }, [error]);

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
          <ShoppingCartIcon />
          <CrumbLink href="#">Order Items</CrumbLink>
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
        <Text h3>All Order Items</Text>
        <Flex direction={"row"} css={{ gap: "$6" }} wrap={"wrap"}>
          <AddEditOrderItemForm />
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
        defaultSortField="order_item_id"
        defaultSortDirection="asc"
        ariaLabel="Order items management table"
        showLimitSelector={true}
        showPagination={true}
        showSorting={false}
      />
    </Flex>
  );
};