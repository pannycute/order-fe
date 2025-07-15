import { useState } from "react";
import { useRouter } from "next/router";
import { Card, Input, Button, Text } from "@nextui-org/react";
import { axiosInstance } from "../../utils/axiosInstance";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/login", { email, password });
      const token = res.data.data.token;
      const user = JSON.stringify(res.data.data);

      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_data", user);

      const userRole = res.data.data.role;
      if (userRole === "user") {
        router.push("/user-dashboard");
      } else {
        router.push("/admin-dashboard");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login gagal. Periksa kembali data Anda."
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
        background: "linear-gradient(120deg, #80000011 0%, #B2222222 50%, #fffbe6 100%)",
        padding: "1rem",
      }}
    >
      <Card
        css={{
          p: "2.5rem 2rem",
          mw: "400px",
          w: "100%",
          borderRadius: '2rem',
          boxShadow: '0 8px 32px 0 rgba(128,0,0,0.09)',
          background: 'rgba(255,255,255,0.99)',
        }}
      >
        <Text h3 css={{ textAlign: "center", mb: "1.2rem", color: '#800000', fontWeight: 700, letterSpacing: 0.5, fontSize: 26 }}>
          Login
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

        <form onSubmit={handleLogin}>
          <Input
            fullWidth
            required
            type="email"
            label="Email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            css={{ mb: "1.1rem", borderRadius: '1rem', background: '#fff', border: '1.5px solid #80000022', color: '#800000', fontSize: 15 }}
          />

          <Input
            fullWidth
            required
            type="password"
            label="Password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            css={{ mb: "1.3rem", borderRadius: '1rem', background: '#fff', border: '1.5px solid #80000022', color: '#800000', fontSize: 15 }}
          />

          <Button
            type="submit"
            css={{
              w: "100%",
              background: 'linear-gradient(90deg, #800000cc 0%, #B22222cc 100%)',
              color: '#fffbe6',
              fontWeight: 'bold',
              fontSize: 15,
              borderRadius: '1.2rem',
              boxShadow: '0 4px 14px 0 rgba(128,0,0,0.08)',
              border: 'none',
              letterSpacing: 0.5,
              transition: 'background 0.2s',
              py: '1.1rem',
            }}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
