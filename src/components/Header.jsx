import { motion } from "framer-motion";
import { Button } from "antd";
import { UserButton, useAuth } from "@clerk/clerk-react";

export default async function Header() {
  const { userId } = useAuth;
  return (
    <header>
      <nav className="bg-blue-950 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-white">AutoPicName</div>
          <div className="flex gap-2">
            {!userId && (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="primary"
                    className="text-blue-600 bg-white hover:bg-blue-700"
                  >
                    Sign Up
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="primary"
                    className="text-blue-600 bg-white hover:bg-blue-700"
                  >
                    Sign In
                  </Button>
                </motion.div>
              </>
            )}
            {userId && (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="primary"
                    className="text-blue-600 bg-white hover:bg-blue-700"
                  >
                    Profile
                  </Button>
                </motion.div>
              </>
            )}
            <div className="ml-auto">
              <UserButton />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
