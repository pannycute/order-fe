import React, { useState, useEffect } from "react";
import { Box } from "../styles/box";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@nextui-org/react";
import { Flex } from "../styles/flex";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { DevIcon } from "../icons/sidebar/dev-icon";
import { ViewIcon } from "../icons/sidebar/view-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { useSidebarContext } from "../layout/layout-context";
import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";
import { useRouter } from "next/router";
import { CreditCard, Receipt } from "lucide-react"; // ✅ Import icon
import { DeleteIcon } from '../icons/table/delete-icon';

export const SidebarWrapper = () => {
  const router = useRouter();
  const { collapsed, setCollapsed } = useSidebarContext();
  const [userRole, setUserRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user_data");
      if (userStr) {
        try {
          setUserRole(JSON.parse(userStr).role || "");
        } catch {}
      } else {
        setUserRole("");
      }
      setIsLoading(false);
    }
  }, []);

  // Tampilkan sidebar minimal untuk user yang belum login
  if (isLoading) {
    return null;
  }

  return (
    <Box
      as="aside"
      css={{
        height: "100vh",
        zIndex: 202,
        position: "sticky",
        top: "0",
      }}
    >
      {collapsed ? <Sidebar.Overlay onClick={setCollapsed} /> : null}

      <Sidebar collapsed={collapsed}>
        <Sidebar.Header>
          <CompaniesDropdown />
        </Sidebar.Header>
        <Flex direction={"column"} justify={"between"} css={{ height: "100%" }}>
          <Sidebar.Body className="body sidebar">
            <SidebarItem
              title="Home"
              icon={<HomeIcon />}
              isActive={
                (userRole === "user" && router.pathname === "/user-dashboard") ||
                (userRole === "admin" && router.pathname === "/admin-dashboard") ||
                (!userRole && router.pathname === "/")
              }
              href={
                userRole === "user"
                  ? "/user-dashboard"
                  : userRole === "admin"
                  ? "/admin-dashboard"
                  : "/"
              }
            />
            
            <SidebarMenu title="Main Menu">
              {/* Menu Products untuk semua user */}
              {userRole && (

              <SidebarItem
                isActive={
                  userRole === 'user'
                    ? router.pathname === "/user-products"
                    : router.pathname === "/products"
                }
                title="Products"
                icon={<ProductsIcon />}
                href={userRole === 'user' ? '/user-products' : 'products'}
              />
              )}

              {/* Menu Pesanan Saya untuk user saja */}
              {userRole === 'user' && (
                <SidebarItem
                  isActive={router.pathname === '/user-orders'}
                  title="Pesanan Saya"
                  icon={<ViewIcon />}
                  href="/user-orders"
                />
              )}
              
              {/* Menu admin hanya untuk user yang sudah login dan role admin */}
              {userRole && userRole !== 'user' && (
                <>
                  <SidebarItem
                    isActive={router.pathname === "/accounts"}
                    title="Accounts"
                    icon={<AccountsIcon />}
                    href="accounts"
                  />
              <SidebarItem
                isActive={router.pathname === "/orders"}
                title="Orders"
                icon={<PaymentsIcon />}
                href="orders"
              />
              <SidebarItem
                isActive={router.pathname === "/order_items"}
                title="Order Items"
                icon={<BalanceIcon />}
                href="order_items"
              />
              <SidebarItem
                isActive={router.pathname === "/paymentmethod"}
                title="Payment Methods"
                    icon={<CreditCard size={18} />}
                href="paymentmethod"
              />
              <SidebarItem
                isActive={router.pathname === "/payment_confirmations"}
                title="Payment Confirmations"
                    icon={<Receipt size={18} />}
                href="/payment_confirmations"
              />
                  <SidebarItem
                    isActive={router.pathname === "/admin-reports"}
                    title="Laporan"
                    icon={<ReportsIcon />}
                    href="/admin-reports"
                  />
                </>
              )}
            </SidebarMenu>
          </Sidebar.Body>
          
          {userRole && (
            <Sidebar.Footer>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: 16,
                  gap: 12,
                }}
                onClick={async () => {
                  try {
                    await import('../../utils/axiosInstance').then(({ axiosInstance }) => axiosInstance.post('/logout'));
                  } catch (err) {
                    console.error('Logout error:', err);
                    // Optional: handle error
                  } finally {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user_data');
                    router.push('/');
                  }
                }}
              >
                <DeleteIcon size={20} fill="#dc2626" />
                Logout
              </button>
            </Sidebar.Footer>
          )}
        </Flex>
      </Sidebar>
    </Box>
  );
};