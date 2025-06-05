import { Button, Text } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useMemo, useCallback } from "react";
import { Flex } from "../styles/flex";
import { TableWrapper, type Column } from "../table/table";
import AddEditUserForm from "./AddEditUserForm";
import { useUserStore } from "../../stores/userStore";
import { useToast } from "../toast/ToastProvider";
import { useConfirmationToast } from "../toast/ConfirmationToast";
import { Edit, Trash2, Eye, HouseIcon, UsersIcon } from "lucide-react";
import { Breadcrumbs, Crumb, CrumbLink } from "../breadcrumb/breadcrumb.styled";

export const Accounts = () => {
  const { data, loading, error, totalData, page, limit, loadAll, deleteOne } =
    useUserStore();

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

  const handleDelete = (user: any) => {
    showConfirmationToast(
      `Are you sure you want to delete "${user.name}"? This action cannot be undone`,
      "error",
      {
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
        onConfirm: async () => {
          await deleteOne(user.user_id);
          showToast("Succses delete user", "success");
        },
        onCancel: () => {
          // Optional: tambahkan logic jika diperlukan saat cancel
          console.log("Penghapusan dibatalkan");
        },
      }
    );
  };

  const columns: Column[] = useMemo(
    () => [
      {
        name: "NAME",
        uid: "name",
        sortable: true,
        render: (user: any) => (
          <div>
            <div style={{ fontWeight: 500 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{user.email}</div>
          </div>
        ),
      },
      {
        name: "ROLE",
        uid: "role",
        sortable: true,
        render: (user: any) => (
          <div>
            <div style={{ fontWeight: 500 }}>{user.role}</div>
          </div>
        ),
      },
      {
        name: "ACTIONS",
        uid: "action",
        sortable: false,
        render: (user: any) => (
          <div style={{ display: "flex", gap: 8 }}>
            {/* <Button size="md" auto aria-label={`View details for ${user.name}`}>
              <Eye size={16} />
            </Button> */}
            <AddEditUserForm
              initialData={user}
              buttonLabel={<Edit size={16} />}
            />
            <Button
              size="md"
              color="error"
              auto
              aria-label={`Delete ${user.name}`}
              onClick={() => handleDelete(user)}
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
          <UsersIcon />
          <CrumbLink href="#">Users</CrumbLink>
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
        <Text h3>All Accounts</Text>
        <Flex direction={"row"} css={{ gap: "$6" }} wrap={"wrap"}>
          <AddEditUserForm />
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
        ariaLabel="Users management table"
        // selectionMode="multiple"
        showLimitSelector={true}
        showPagination={true}
        showSorting={false}
      />
    </Flex>
  );
};
