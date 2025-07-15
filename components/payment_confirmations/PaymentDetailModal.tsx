import React from "react";
import {
  Modal,
  Button,
  Text,
  Image,
  Badge,
} from "@nextui-org/react";
import { PaymentConfirmation } from "../../types";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { STORAGE_URL } from "../../utils/axiosInstance";

interface PaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentConfirmation | null;
  onConfirm: (id: number) => void;
  onReject: (id: number) => void;
  loading: boolean;
}

export const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
  isOpen,
  onClose,
  payment,
  onConfirm,
  onReject,
  loading,
}) => {
  if (!payment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "rejected":
        return "Rejected";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Modal.Header>
        <Text h4>Payment Confirmation Detail</Text>
        <Text size="sm" color="gray">
          ID: {payment.confirmation_id}
        </Text>
      </Modal.Header>
      <Modal.Body>
          <div className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <Text b>Status:</Text>
              <Badge color={getStatusColor(payment.status) as any}>
                {getStatusText(payment.status)}
              </Badge>
            </div>

            {/* Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text b>Order ID:</Text>
                <Text>{payment.order_id}</Text>
              </div>
              <div>
                <Text b>User ID:</Text>
                <Text>{payment.user_id}</Text>
              </div>
              <div>
                <Text b>Amount:</Text>
                <Text>{formatCurrency(payment.amount)}</Text>
              </div>
              <div>
                <Text b>Payment Method ID:</Text>
                <Text>{payment.payment_method_id}</Text>
              </div>
            </div>

            {/* Confirmation Date */}
            <div>
              <Text b>Confirmation Date:</Text>
              <Text>{formatDate(payment.confirmation_date)}</Text>
            </div>

            {/* Bukti Transfer */}
            {payment.bukti_transfer && (
              <div>
                <Text b>Bukti Transfer:</Text>
                <div className="mt-2">
                  <Image
                    src={payment.bukti_transfer}
                    alt="Bukti Transfer"
                    className="max-w-full h-auto rounded-lg"
                    style={{ maxHeight: "300px", objectFit: "contain" }}
                  />
                </div>
              </div>
            )}
            {/* Proof Image */}
            {payment.proof_image && (
              <div>
                <Text b>Proof Image:</Text>
                <div className="mt-2">
                  <Image
                    src={`${STORAGE_URL}/${payment.proof_image}`}
                    alt="Proof Image"
                    className="max-w-full h-auto rounded-lg"
                    style={{ maxHeight: "300px", objectFit: "contain" }}
                  />
                </div>
              </div>
            )}

            {/* Created/Updated Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              {payment.created_at && (
                <div>
                  <Text size="sm">Created:</Text>
                  <Text size="sm">{formatDate(payment.created_at)}</Text>
                </div>
              )}
              {payment.updated_at && (
                <div>
                  <Text size="sm">Updated:</Text>
                  <Text size="sm">{formatDate(payment.updated_at)}</Text>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="default" onPress={onClose}>
            Close
          </Button>
          {payment.status === "pending" && (
            <>
              <Button
                color="default"
                onPress={() => onReject(payment.confirmation_id)}
              >
                Reject Payment
              </Button>
              <Button
                color="primary"
                onPress={() => onConfirm(payment.confirmation_id)}
              >
                Confirm Payment
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
  );
}; 