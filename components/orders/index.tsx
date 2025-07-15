// @/components/[content]/orders/index.tsx
import { Button, Text } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useMemo, useCallback, useState } from "react";
import { Flex } from "../styles/flex";
import { TableWrapper, type Column } from "../table/table";
import AddEditOrderForm from "./AddEditForm";
import { useToast } from "../toast/ToastProvider";
import { useConfirmationToast } from "../toast/ConfirmationToast";
import { Edit, Trash2, Eye, HouseIcon, ShoppingCartIcon } from "lucide-react";
import { Breadcrumbs, Crumb, CrumbLink } from "../breadcrumb/breadcrumb.styled";
import { useOrderStore } from "../../stores/orderStore";
import { useOrderItemStore } from '../../stores/orderItemStore';
import { useProductStore } from '../../stores/productStore';

export const Orders = () => {
  const {
    data,
    loading,
    error,
    totalData,
    page,
    limit,
    loadAll,
    deleteOne,
  } = useOrderStore();

  const { showToast } = useToast();
  const { showToast: showConfirmationToast } = useConfirmationToast();

  const [userRole, setUserRole] = useState<string>("");

  const orderItemStore = useOrderItemStore();
  const productStore = useProductStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user_data");
      if (userStr) {
        try {
          setUserRole(JSON.parse(userStr).role || "");
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    orderItemStore.loadAll(1, 1000);
    productStore.loadAll(1, 1000);
  }, [orderItemStore, productStore]);

  useEffect(() => {
    console.log('OrderItemStore:', orderItemStore.data);
    console.log('OrderStore:', data);
  }, [orderItemStore.data, data]);

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

  const handleDelete = useCallback((order: any) => {
    showConfirmationToast(
      `Are you sure you want to delete order "${order.order_id}"? This action cannot be undone.`,
      "error",
      {
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
        onConfirm: async () => {
          await deleteOne(order.order_id);
          showToast("Success delete order", "success");
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
        name: "ORDER ID",
        uid: "order_id",
        sortable: true,
        render: (order: any) => order.order_id ?? "-",
      },
      {
        name: "DATE",
        uid: "order_date",
        sortable: true,
        render: (order: any) =>
          order.order_date ? new Date(order.order_date).toLocaleDateString() : "-",
      },
      {
        name: "STATUS",
        uid: "status",
        sortable: true,
        render: (order: any) => order.status ?? "-",
      },
      {
        name: "TOTAL AMOUNT",
        uid: "total_amount",
        sortable: true,
        render: (order: any) => {
          if (order.total_amount === null || order.total_amount === undefined || order.total_amount === '') {
            return '0';
          }
          const num = Number(order.total_amount);
          if (isNaN(num)) return '-';
          return num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        },
      },
      {
        name: 'PRODUCTS',
        uid: 'products',
        sortable: false,
        render: (order: any) => {
          const items = orderItemStore.data.filter((item) => item.order_id === order.order_id);
          console.log('Order:', order.order_id, 'Items:', items);
          if (items.length === 0) return '-';
          return (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {items.map((item) => {
                const product = productStore.data.find((p) => p.product_id === item.product_id);
                return (
                  <li key={item.order_item_id}>
                    {product ? product.name : 'Produk'} x {item.quantity}
                  </li>
                );
              })}
            </ul>
          );
        },
      },
      (userRole === "user" || userRole === "admin")
        ? {
        name: "ACTIONS",
        uid: "action",
        sortable: false,
        render: (order: any) => (
          <div style={{ display: "flex", gap: 8 }}>
            <AddEditOrderForm
              initialData={order}
              buttonLabel={<Edit size={16} />}
            />
            <Button
              size="md"
              color="error"
              auto
              aria-label={`Delete ${order.order_id}`}
              onClick={() => handleDelete(order)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ),
          }
        : null,
    ].filter(Boolean) as Column[],
    [handleDelete, userRole, orderItemStore.data, productStore.data]
  );
  
  useEffect(() => {
    console.log("DATA:", data);
  }, [data]);
    
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
          <ShoppingCartIcon />
          <CrumbLink href="#">Orders</CrumbLink>
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
        <Text h3>All Orders</Text>
        <Flex direction={"row"} css={{ gap: "$6" }} wrap={"wrap"}>
          {userRole === "user" && <AddEditOrderForm />}
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
        defaultSortField="order_id"
        defaultSortDirection="asc"
        ariaLabel="Orders management table"
        showLimitSelector={true}
        showPagination={true}
        showSorting={false}
      />
    </Flex>
  );
};