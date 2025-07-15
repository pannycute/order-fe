// /components/[content]/Products/AddEditForm.tsx
import React, { useState, useEffect } from "react";
import { Button, Divider, Input, Modal, Text } from "@nextui-org/react";
import { Flex } from "../styles/flex";
import { useProductStore } from "../../stores/productStore";
import { useToast } from "../toast/ToastProvider";
import InputSelect from "../input/InputSelect";
import { Product } from "../../types";

interface AddEditProductProps {
  initialData?: Product | null;
  buttonLabel?: any;
}

const AddEditProductForm: React.FC<AddEditProductProps> = ({
  initialData = null,
  buttonLabel,
}) => {
  const [visible, setVisible] = useState(false);
  const isEditMode = !!initialData?.product_id;
  const { addOne, updateOne, loading } = useProductStore();
  const { showToast } = useToast();

  const [form, setForm] = useState<Product>({
    product_id: undefined,
    name: "",
    price: 0,
    stock: 0,
    description: "",
    duration: 1,
  });

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
          product_id: initialData.product_id,
          name: initialData.name || "",
          price: initialData.price || 0,
          stock: initialData.stock || 0,
          description: initialData.description || "",
          duration: initialData.duration || 1,
        });
      } else {
        setForm({
          product_id: undefined,
          name: "",
          price: 0,
          stock: 0,
          description: "",
          duration: 1,
        });
      }
    }
  }, [visible, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      console.log(form);
      if (isEditMode && form.product_id) {
        await updateOne(form.product_id, form);
        showToast("Successfully updated product", "success");
      } else {
        const { product_id, ...payload } = form;
        await addOne(payload);
        showToast("Successfully created product", "success");
      }
      closeHandler();
    } catch (error: any) {
      const message = error.response?.data?.message || "An error occurred";
      showToast(message, "error");
      console.error("Error saving product:", error);
    }
  };

  return (
    <div>
      <Button auto onClick={handler}>
        {buttonLabel || (isEditMode ? "Edit Product" : "Add Product")}
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
            {isEditMode ? "Edit Product" : "Add New Product"}
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
            <Input
              label="Product Name"
              name="name"
              bordered
              clearable
              fullWidth
              size="lg"
              placeholder="Enter product name"
              value={form.name}
              onChange={handleChange as any}
            />
            <Input
              label="Product Description"
              name="description"
              bordered
              clearable
              fullWidth
              size="lg"
              placeholder="Enter product description"
              value={form.description}
              onChange={handleChange as any}
            />
            <Input
              label="Price"
              name="price"
              type="number"
              min="0"
              step="any"
              bordered
              clearable
              fullWidth
              size="lg"
              placeholder="Enter product price"
              value={form.price.toString()}
              onChange={handleChange as any}
            />
            <Input
              label="Stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              bordered
              clearable
              fullWidth
              size="lg"
              placeholder="Enter product stock"
              value={form.stock.toString()}
              onChange={handleChange as any}
            />
            <Input
              label="Duration"
              name="duration"
              type="number"
              min="1"
              step="1"
              bordered
              clearable
              fullWidth
              size="lg"
              placeholder="Enter product duration"
              value={form.duration?.toString() || ""}
              onChange={handleChange as any}
            />
          </Flex>
        </Modal.Body>
        <Divider css={{ my: "$5" }} />
        <Modal.Footer>
          <Button auto onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Product"
              : "Add Product"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddEditProductForm;
