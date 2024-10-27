"use client";
// import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { Button, Input, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [formType, setFormType] = useState("signup");

  const navigate = useNavigate();

  const switchForm = (type) => {
    setFormType(type);
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    message.success(
      `${formType.charAt(0).toUpperCase() + formType.slice(1)} successful!`
    );
    if (!isLoaded) {
      return;
    }
    if (formType === "signup") {
      setFormType("otp");
    } else if (formType === "otp") {
      setFormType("signin");
    }

    try {
      await signUp.create({
        first_name: firstName,
        last_name: lastName,
        email_address: email,
        password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Verify User Email Code
  const onPressVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        navigate("/home");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div
      className="min-w-full min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-5 rounded"
      style={{ width: "500px" }}
    >
      <motion.div
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {formType === "signup"
            ? "Create an Account"
            : formType === "otp"
            ? "Verify OTP"
            : "Welcome Back"}
        </h2>
        {!pendingVerification && formType === "signup" && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  First Name
                </label>
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  type="text"
                  name="first_name"
                  id="first_name"
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={true}
                />
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Last Name
                </label>
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  type="text"
                  name="last_name"
                  id="last_name"
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={true}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Email Address
                </label>
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="name@company.com"
                  required={true}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={true}
                />
              </div>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                {formType === "signup"
                  ? "Sign Up"
                  : formType === "otp"
                  ? "Verify OTP"
                  : "Sign In"}
              </Button>
              <p className="mt-4 text-center text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => switchForm("signin")}
                  className="text-blue-600 hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        )}
        {formType === "signin" && (
          <div className="space-y-4 md:space-y-6">
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              type="email"
              placeholder="Email"
              required
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              required
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              {formType === "signup"
                ? "Sign Up"
                : formType === "otp"
                ? "Verify OTP"
                : "Sign In"}
            </Button>
            <p className="mt-4 text-center text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => switchForm("signup")}
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        )}
        {pendingVerification && formType === "otp" && (
          <div>
            <form className="space-y-4 md:space-y-6">
              <Input
                prefix={<KeyOutlined className="text-gray-400" />}
                value={code}
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Verification Code..."
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                type="submit"
                onClick={onPressVerify}
                className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Verify Email
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RegisterPage;
