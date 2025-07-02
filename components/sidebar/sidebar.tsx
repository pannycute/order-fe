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
import { CreditCard, CreditCardIcon } from "lucide-react"; // ✅ Import icon
import { DeleteIcon } from '../icons/table/delete-icon';

export const SidebarWrapper = () => {
  const router = useRouter();
  const { collapsed, setCollapsed } = useSidebarContext();
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUserRole(JSON.parse(userStr).role || "");
        } catch {}
      } else {
        setUserRole("");
      }
    }
  }, []);

  // Jangan render menu sensitif sebelum userRole diketahui
  if (userRole === "") {
    return null; // atau bisa diganti skeleton/sidebar kosong
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
              isActive={router.pathname === "/"}
              href="/"
            />
            <SidebarMenu title="Main Menu">
              {userRole !== 'user' && (
                <SidebarItem
                  isActive={router.pathname === "/accounts"}
                  title="Accounts"
                  icon={<AccountsIcon />}
                  href="accounts"
                />
              )}
              {userRole !== 'user' && (
                <SidebarItem
                  isActive={router.pathname === "/products"}
                  title="Products"
                  icon={<ProductsIcon />}
                  href="products"
                />
              )}
              {/* Tambahan menu Orders */}
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
              {userRole !== 'user' && (
                <SidebarItem
                  isActive={router.pathname === "/paymentmethod"}
                  title="Payment Methods"
                  icon={<CreditCard size={18} />}
                  href="paymentmethod"
                />
              )}
              <SidebarItem
                isActive={router.pathname === "/payment_confirmations"}
                title="Payment Confirmations"
                icon={<CreditCardIcon size={18} />}
                href="/payment_confirmations"
              />
            </SidebarMenu>
          </Sidebar.Body>
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
                  await import('../../utils/axiosInstance').then(({ axiosInstance }) => axiosInstance.post('/api/logout'));
                } catch (err) {
                  // Optional: handle error
                } finally {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  router.push('/login');
                }
              }}
            >
              <DeleteIcon size={20} fill="#dc2626" />
              Logout
            </button>
          </Sidebar.Footer>
        </Flex>
      </Sidebar>
    </Box>
  );
};