import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Divider, Text } from "@nextui-org/react";
import { useToast } from "../toast/ToastProvider";
import { Flex } from "../styles/flex";
import InputSelect from "../input/InputSelect";
import { axiosInstance } from "../../utils/axiosInstance";
import { usePaymentConfirmationStore } from "../../stores/paymentConfirmationsStore";

export interface ConfirmationForm {
  confirmation_id?: number;
  order_id?: number;
  product_id?: number;
  quantity?: number;
  unit_price?: number;
  subtotal?: number;
}

interface Props {
  initialData?: ConfirmationForm | null;
  buttonLabel?: React.ReactNode;
}

const AddEditPaymentConfirmationForm: React.FC<Props> = ({
  initialData = null,
  buttonLabel,
}) => {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState<Partial<ConfirmationForm>>({
    order_id: undefined,
    product_id: undefined,
    quantity: 0,
    unit_price: 0,
    subtotal: 0,
  });

  const { addOne, updateOne, loading } = usePaymentConfirmationStore();
  const { showToast } = useToast();
  const [orderOptions, setOrderOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const isEdit = !!initialData?.confirmation_id;

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (visible) {
      if (initialData) {
        setForm(initialData);
      } else {
        setForm({
          order_id: undefined,
          product_id: undefined,
          quantity: 0,
          unit_price: 0,
          subtotal: 0,
        });
      }
    }
  }, [visible, initialData]);

  // Hitung subtotal saat quantity atau unit_price berubah
  useEffect(() => {
    const subtotal = (form.quantity || 0) * (form.unit_price || 0);
    setForm((prev) => ({ ...prev, subtotal }));
  }, [form.quantity, form.unit_price]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "unit_price" ? Number(value) : value,
    }));
  };

  const fetchOrderOptions = async (query: string) => {
    try {
      const res = await axiosInstance.get("/orders", {
        params: { order: query, page: 1, limit: 10 },
      });
      const data = res.data.data.map((item: any) => ({
        id: item.order_id,
        label: `Order #${item.order_id}`,
      }));
      setOrderOptions(data);
      return data;
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to fetch orders", "error");
      return [];
    }
  };  

  const fetchProductOptions = async (query: string) => {
    try {
      const res = await axiosInstance.get("/products", {
        params: { product: query, page: 1, limit: 10 },
      });
      const data = res.data.data.map((item: any) => ({
        id: item.product_id,
        label: `Product #${item.product_id}`,
      }));
      setProductOptions(data);
      return data;
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to fetch products", "error");
      return [];
    }
  };  

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        subtotal: (form.quantity || 0) * (form.unit_price || 0),
      };

      if (isEdit && form.confirmation_id) {
        await updateOne(form.confirmation_id, payload);
        showToast("Successfully updated", "success");
      } else {
        await addOne(payload);
        showToast("Successfully created", "success");
      }
      setVisible(false);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to save", "error");
    }
  };

  return (
    <>
      <Button auto onClick={() => setVisible(true)}>
        {buttonLabel || (isEdit ? "Edit Confirmation" : "Add Confirmation")}
      </Button>

      <Modal open={visible} onClose={() => setVisible(false)} width="600px">
        <Modal.Header>
          <Text h4>{isEdit ? "Edit Payment Confirmation" : "Add Payment Confirmation"}</Text>
        </Modal.Header>
        <Divider />
        <Modal.Body>
          <Flex direction="column" css={{ gap: "$8" }}>
            <InputSelect
              label="Order ID"
              selectedId={form.order_id ?? null}
              options={orderOptions}
              onSearch={fetchOrderOptions}
              onChange={(option) =>
                setForm((prev) => ({ ...prev, order_id: Number(option?.id) }))
              }
              placeholder="Select Order"
            />

            <InputSelect
              label="Product ID"
              selectedId={form.product_id ?? null}
              options={productOptions}
              onSearch={fetchProductOptions}
              onChange={(option) =>
                setForm((prev) => ({ ...prev, product_id: Number(option?.id) }))
              }
              placeholder="Select Product"
            />

            <Input
              label="Quantity"
              name="quantity"
              type="number"
              value={form.quantity?.toString() || ""}
              onChange={handleChange}
              fullWidth
            />

            <Input
              label="Unit Price"
              name="unit_price"
              type="number"
              value={form.unit_price?.toString() || ""}
              onChange={handleChange}
              fullWidth
            />

            <Input
              label="Subtotal"
              name="subtotal"
              type="number"
              value={form.subtotal?.toString() || "0"}
              readOnly
              fullWidth
            />
          </Flex>
        </Modal.Body>
        <Divider />
        <Modal.Footer>
          <Button auto onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEditPaymentConfirmationForm;
