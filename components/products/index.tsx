// /components/[content]/Products/index.tsx
import { Button, Text } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useMemo, useCallback } from "react";
import { Flex } from "../styles/flex";
import { TableWrapper, type Column } from "../table/table";
import AddEditProductForm from "./AddEditForm";
import { useProductStore } from "../../stores/productStore";
import { useToast } from "../toast/ToastProvider";
import { useConfirmationToast } from "../toast/ConfirmationToast";
import { Edit, Trash2, Eye, HouseIcon, Box } from "lucide-react";
import { Breadcrumbs, Crumb, CrumbLink } from "../breadcrumb/breadcrumb.styled";

export const Products = () => {
  const { data, loading, error, totalData, page, limit, loadAll, deleteOne } =
    useProductStore();

  const { showToast } = useToast();
  const { showToast: showConfirmationToast } = useConfirmationToast();

  // Load data saat pertama kali component mount & jika pagination berubah
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

  const handleDelete = useCallback((product: any) => {
    showConfirmationToast(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone`,
      "error",
      {
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
        onConfirm: async () => {
          try {
            await deleteOne(product.product_id);
            showToast("Successfully deleted product", "success");
          } catch (err) {
            console.error("Error deleting product:", err);
            showToast("Failed to delete product", "error");
          }
        },
        onCancel: () => {
          console.log("Deletion canceled");
        },
      }
    );
  }, [showConfirmationToast, deleteOne, showToast]);

  const columns: Column[] = useMemo(
    () => [
      {
        name: "NAME",
        uid: "name",
        sortable: true,
        render: (product: any) => (
          <div>
            <div style={{ fontWeight: 500 }}>{product.name}</div>
          </div>
        ),
      },
      {
        name: "PRICE",
        uid: "price",
        sortable: true,
        render: (product: any) => (
          <div>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(product.price)}
          </div>
        ),
      },
      {
        name: "STOCK",
        uid: "stock",
        sortable: true,
        render: (product: any) => <div>{product.stock}</div>,
      },
      {
        name: "ACTIONS",
        uid: "action",
        sortable: false,
        render: (product: any) => (
          <div style={{ display: "flex", gap: 8 }}>
            <AddEditProductForm
              initialData={product}
              buttonLabel={<Edit size={16} />}
            />
            <Button
              size="md"
              color="error"
              auto
              aria-label={`Delete ${product.name}`}
              onClick={() => handleDelete(product)}
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
          <Box />
          <CrumbLink href="#">Products</CrumbLink>
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
        <Text h3>All Products</Text>
        <Flex direction={"row"} css={{ gap: "$6" }} wrap={"wrap"}>
          <AddEditProductForm />
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
        defaultSortField="name"
        defaultSortDirection="asc"
        ariaLabel="Products management table"
        showLimitSelector={true}
        showPagination={true}
        showSorting={false}
      />
    </Flex>
  );
};
