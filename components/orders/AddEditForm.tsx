// @/components/[content]/orders/AddEditForm.tsx
import React, { useState, useEffect } from "react";
import { Button, Divider, Input, Modal, Text } from "@nextui-org/react";
import { Flex } from "../styles/flex";
import InputSelect from "../input/InputSelect";
import { useToast } from "../toast/ToastProvider";
import { axiosInstance } from "../../utils/axiosInstance";
import { Dropdown } from "@nextui-org/react"; 
import { Key } from "react";
import { Order, useOrderStore } from "../../stores/orderstore";

interface AddEditOrderProps {
  initialData?: Order | null;
  buttonLabel?: any;
}

const AddEditOrderForm: React.FC<AddEditOrderProps> = ({
  initialData = null,
  buttonLabel,
}) => {
  const [visible, setVisible] = useState(false);
  const isEditMode = !!initialData?.order_id;
  const [userOptions, setUserOptions] = useState([])
  const { showToast } = useToast();
  // Ambil user login dari localStorage
  const getUserFromStorage = () => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user_data');
    return userStr ? JSON.parse(userStr) : null;
  };
  // Default order_date hari ini jika tambah order
  const today = new Date().toISOString().slice(0, 10);
  const user = getUserFromStorage();
  const [form, setForm] = useState<Partial<Order>>({
    order_id: undefined,
    user_id: !isEditMode && user && user.role === 'user' ? user.user_id : undefined,
    order_date: !isEditMode ? today : '',
    status: 'pending',
    total_amount: undefined,
    created_at: '',
    updated_at: '',
  });

  const { addOne, updateOne, loading } = useOrderStore();

  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (visible) {
      if (initialData) {
        setForm({
          order_id: initialData.order_id || undefined,
          user_id: initialData.user_id || undefined,
          order_date: initialData.order_date || today,
          status: initialData.status || "panding",
          total_amount: initialData.total_amount || 0,
          created_at: initialData.created_at || "",
          updated_at: initialData.updated_at || "",
        });
      } else {
        setForm({
            order_id: undefined,
          user_id: user && user.role === 'user' ? user.user_id : undefined,
          order_date: today,
            status: "pending",
            total_amount: undefined,
            created_at: "",
            updated_at: "",
        });
      }
    }
  }, [visible, initialData, today, user]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchUserOptions = async (query: string): Promise<any[]> => {
    try {
      const res = await axiosInstance.get("/users", {
        params: {
          name: query,
          limit: 10,
          page: 1,
        },
      });
      const users = res.data.data.map((item: any) => ({
        id: item.user_id,
        label: `${item.name}`,
      }));

      setUserOptions(users)
      return users
    } catch (err) {
      console.error("Error fetching users:", err);
      return []
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && form.order_id) {
        await updateOne(form.order_id, form);
        showToast("Success update order", "success");
      } else {
        await addOne(form);
        showToast("Success create order", "success");
      }
      closeHandler();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "An unexpected error occurred";
      showToast(message, "error");
    }
  };

  return (
    <div>
      <Button auto onClick={handler}>
        {buttonLabel || (isEditMode ? "Edit Order" : "Add Order")}
      </Button>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        width="600px"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header css={{ justifyContent: "start" }}>
          <Text id="modal-title" h4>
            {isEditMode ? "Edit Order" : "Add New Order"}
          </Text>
        </Modal.Header>
        <Divider css={{ my: "$5" }} />
        <Modal.Body css={{ py: "$10" }}>
          <Flex
            direction={"column"}
            css={{
              flexWrap: "wrap",
              gap: "$8",
              "@lg": { flexWrap: "nowrap", gap: "$12" },
            }}
          >

            {/* Jika user login sebagai user, sembunyikan input user */}
            {!(user && user.role === 'user') && (
            <InputSelect
              label="User"
              options={userOptions}
              onSearch={fetchUserOptions}
              selectedId={form.user_id ?? null}
              onChange={(option) =>
                option &&
                setForm((prev) => ({ ...prev, user_id: Number(option.id) }))
              }
              placeholder="Select User"
            />
            )}

            <Input
              label="Order Date"
              name="order_date"
              type="date"
              clearable
              bordered
              fullWidth
              size="lg"
              placeholder="Enter order date"
              value={form.order_date}
              onChange={handleChange}
              disabled={user && user.role === 'user'}
            />

<Dropdown>
  <Dropdown.Button flat>
    {form.status || "Select Status"}
  </Dropdown.Button>
  <Dropdown.Menu
    aria-label="Status Menu"
    selectionMode="single"
    disallowEmptySelection
    selectedKeys={form.status ? new Set([form.status]) : new Set([])}
    onSelectionChange={(keys: "all" | Set<Key>) => {
      if (keys !== "all") {
        const selected = Array.from(keys)[0] as string;
        setForm((prev) =>
          ({
            ...prev,
            status: selected,
          } as Partial<Order>)
        );
      }
    }}
  >
    <Dropdown.Item key="pending">Pending</Dropdown.Item>
    <Dropdown.Item key="proses">Proses</Dropdown.Item>
    <Dropdown.Item key="selesai">Selesai</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>




            <Input
              label="Total Amount"
              name="total_amount"
              type="number"
              clearable
              bordered
              fullWidth
              size="lg"
              placeholder="Enter total amount"
              value={form.total_amount}
              onChange={handleChange}
            />
          </Flex>
        </Modal.Body>
        <Divider css={{ my: "$5" }} />
        <Modal.Footer>
          <Button auto onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : isEditMode ? "Update Order" : "Add Order"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddEditOrderForm;