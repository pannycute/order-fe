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
import { useOrderStore } from "../../stores/orderstore";

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUserRole(JSON.parse(userStr).role || "");
        } catch {}
      }
    }
  }, []);

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

  const handleDelete = (order: any) => {
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
  };

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
        render: (order: any) => order.total_amount?.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        }) ?? "-",
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
    [handleDelete, userRole]
  );
  
  useEffect(() => {
    console.log("DATA:", data);
  }, [data]);
    
  useEffect(() => {
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