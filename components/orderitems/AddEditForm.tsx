// /components/orderitems/AddEditForm.tsx
import React, { useState, useEffect } from "react";
import { Button, Divider, Input, Modal, Text } from "@nextui-org/react";
import { Flex } from "../styles/flex";
import InputSelect from "../input/InputSelect";
import { useToast } from "../toast/ToastProvider";
import { OrderItem, useOrderItemStore } from "../../stores/orderItemStore";
import { axiosInstance } from "../../utils/axiosInstance";

interface AddEditOrderItemProps {
  initialData?: OrderItem | null;
  buttonLabel?: any;
}

const AddEditOrderItemForm: React.FC<AddEditOrderItemProps> = ({
  initialData = null,
  buttonLabel,
}) => {
  const [visible, setVisible] = useState(false);
  const isEditMode = !!initialData?.order_item_id;
  const [orderOptions, setOrderOptions] = useState<any[]>([]);
  const [productOptions, setProductOptions] = useState<any[]>([]);
  const { showToast } = useToast();

  const [form, setForm] = useState<Partial<OrderItem>>({
    order_item_id: undefined,
    order_id: undefined,
    product_id: undefined,
    quantity: undefined,
    unit_price: undefined,
    subtotal: undefined,
  });

  const { addOne, updateOne, loading } = useOrderItemStore();

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
          order_item_id: initialData.order_item_id || undefined,
          order_id: initialData.order_id || undefined,
          product_id: initialData.product_id || undefined,
          quantity: initialData.quantity || undefined,
          unit_price: initialData.unit_price || undefined,
          subtotal: initialData.subtotal || undefined,
        });
      } else {
        setForm({
          order_item_id: undefined,
          order_id: undefined,
          product_id: undefined,
          quantity: undefined,
          unit_price: undefined,
          subtotal: undefined,
        });
      }
    }
  }, [visible, initialData]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fetchOrderOptions = async (query: string): Promise<any[]> => {
    try {
      const res = await axiosInstance.get("/orders", {
        params: {
          id: query,
          limit: 10,
          page: 1,
        },
      });
      const orders = res.data.data.map((item: any) => ({
        id: item.order_id,
        label: `${item.order_id}`,
      }));
      setOrderOptions(orders);
      return orders;
    } catch (err) {
      console.error("Error fetching orders:", err);
      return [];
    }
  };

  const fetchProductOptions = async (query: string): Promise<any[]> => {
    try {
      const res = await axiosInstance.get("/products", {
        params: {
          id: query,
          limit: 10,
          page: 1,
        },
      });
      const products = res.data.data.map((item: any) => ({
        id: item.product_id,
        label: `${item.product_id}`,
      }));
      setProductOptions(products);
      return products;
    } catch (err) {
      console.error("Error fetching products:", err);
      return [];
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && form.order_item_id) {
        await updateOne(form.order_item_id, form);
        showToast("Success update order item", "success");
      } else {
        await addOne(form);
        showToast("Success create order item", "success");
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
        {buttonLabel || (isEditMode ? "Edit Order Item" : "Add Order Item")}
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
            {isEditMode ? "Edit Order Item" : "Add New Order Item"}
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
            <InputSelect
              label="Order"
              options={orderOptions}
              onSearch={fetchOrderOptions}
              selectedId={form.order_id ?? null}
              onChange={(option) =>
                option &&
                setForm((prev) => ({
                  ...prev,
                  order_id: Number(option.id),
                }))
              }
              placeholder="Select Order"
            />

            <InputSelect
              label="Product"
              options={productOptions}
              onSearch={fetchProductOptions}
              selectedId={form.product_id ?? null}
              onChange={(option) =>
                option &&
                setForm((prev) => ({
                  ...prev,
                  product_id: Number(option.id),
                }))
              }
              placeholder="Select Product"
            />

            <Input
              label="Quantity"
              name="quantity"
              type="number"
              clearable
              bordered
              fullWidth
              size="lg"
              placeholder="Enter quantity"
              value={form.quantity?.toString() || ""}
              onChange={handleChange}
            />

            <Input
              label="Unit Price"
              name="unit_price"
              type="number"
              clearable
              bordered
              fullWidth
              size="lg"
              placeholder="Enter unit price"
              value={form.unit_price?.toString() || ""}
              onChange={handleChange}
            />

            <Input
              label="Subtotal"
              name="subtotal"
              type="number"
              clearable
              bordered
              fullWidth
              size="lg"
              placeholder="Enter subtotal"
              value={form.subtotal?.toString() || ""}
              onChange={handleChange}
            />
          </Flex>
        </Modal.Body>
        <Divider css={{ my: "$5" }} />
        <Modal.Footer>
          <Button auto onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Order Item"
              : "Add Order Item"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddEditOrderItemForm;