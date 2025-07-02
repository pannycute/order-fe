import { useState } from "react";
import { useRouter } from "next/router";
import { Card, Input, Button, Text } from "@nextui-org/react";
import { axiosInstance } from "../utils/axiosInstance";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axiosInstance.post("/register", { name, email, password, role: 'user' });
      setSuccess("Registrasi berhasil! Silakan login.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registrasi gagal. Periksa kembali data Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f1f3f5",
        padding: "1rem",
      }}
    >
      <Card
        css={{
          p: "2rem",
          mw: "400px",
          w: "100%",
        }}
      >
        <Text h3 css={{ textAlign: "center", mb: "1.5rem" }}>
          Register Akun
        </Text>

        {error && (
          <Text
            size="$sm"
            color="error"
            css={{ mb: "1rem", textAlign: "center" }}
          >
            {error}
          </Text>
        )}
        {success && (
          <Text
            size="$sm"
            color="success"
            css={{ mb: "1rem", textAlign: "center" }}
          >
            {success}
          </Text>
        )}

        <form onSubmit={handleRegister}>
          <Input
            fullWidth
            required
            type="text"
            label="Nama"
            placeholder="Masukkan nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            css={{ mb: "1.2rem" }}
          />
          <Input
            fullWidth
            required
            type="email"
            label="Email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            css={{ mb: "1.2rem" }}
          />
          <Input
            fullWidth
            required
            type="password"
            label="Password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            css={{ mb: "1.5rem" }}
          />

          <Button
            type="submit"
            color="primary"
            disabled={loading}
            auto
            css={{ w: "100%" }}
          >
            {loading ? "Memproses..." : "Register"}
          </Button>
        </form>
      </Card>
    </div>
  );
} 