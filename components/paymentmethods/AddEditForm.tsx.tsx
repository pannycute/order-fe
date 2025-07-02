// @/components/paymentmethods/AddEditForm.tsx
import React, { useState, useEffect } from "react";
import { Button, Divider, Input, Modal, Text } from "@nextui-org/react";
import { Flex } from "../styles/flex";
import InputSelect from "../input/InputSelect";
import { useToast } from "../toast/ToastProvider";
import { PaymentMethod, usePaymentMethodStore } from "../../stores/paymentmethodStore";
import { axiosInstance } from "../../utils/axiosInstance";

interface AddEditPaymentMethodProps {
  initialData?: PaymentMethod | null;
  buttonLabel?: any;
}

const AddEditPaymentMethodForm: React.FC<AddEditPaymentMethodProps> = ({
  initialData = null,
  buttonLabel,
}) => {
  const [visible, setVisible] = useState(false);
  const isEditMode = !!initialData?.payment_method_id;

  const { showToast } = useToast();
  const [form, setForm] = useState<Partial<PaymentMethod>>({
    payment_method_id: undefined,
    method_name: "",
    details: "",
  });

  const { addOne, updateOne, loading } = usePaymentMethodStore();

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
          payment_method_id: initialData.payment_method_id || undefined,
          method_name: initialData.method_name || "",
          details: initialData.details || "",
        });
      } else {
        setForm({
          payment_method_id: undefined,
          method_name: "",
          details: "",
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
      if (isEditMode && form.payment_method_id) {
        await updateOne(form.payment_method_id, form);
        showToast("Success update payment method", "success");
      } else {
        await addOne(form);
        showToast("Success create payment method", "success");
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
        {buttonLabel || (isEditMode ? "Edit Payment Method" : "Add Payment Method")}
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
            {isEditMode ? "Edit Payment Method" : "Add New Payment Method"}
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
              label="Method Name"
              name="method_name"
              clearable
              bordered
              fullWidth
              size="lg"
              placeholder="Enter method name"
              value={form.method_name}
              onChange={handleChange as any}
            />
            <Input
              label="Details"
              name="details"
              clearable
              bordered
              fullWidth
              size="lg"
              placeholder="Enter details"
              value={form.details ?? ""}
              onChange={handleChange as any}
            />
          </Flex>
        </Modal.Body>
        <Divider css={{ my: "$5" }} />
        <Modal.Footer>
          <Button auto onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddEditPaymentMethodForm;