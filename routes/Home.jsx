// export default function Home(){
//     return (
//       <div className="bg-white">
//         <header className="absolute inset-x-0 top-0 z-50">
//           <nav
//             aria-label="Global"
//             className="flex items-center justify-between p-6 lg:px-8"
//           ></nav>
//         </header>
//         <body>
//           <h2>HOME</h2>
//         </body>
//       </div>
//     );
// }
import PropTypes from "prop-types";
import { Button, Steps, Card } from "antd";
import {
  UploadOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  const slideIn = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-blue-600">ImageRenamer</div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="primary" className="bg-blue-600 hover:bg-blue-700">
              Sign Up
            </Button>
          </motion.div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white overflow-hidden">
        <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
          <motion.div
            className="md:w-1/2 mb-10 md:mb-0"
            initial="hidden"
            animate="visible"
            variants={slideIn}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Effortlessly Rename Your Images in Bulk
            </h1>
            <p className="text-xl mb-6">
              Save time by renaming thousands of images in just a few clicks.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="primary"
                size="large"
                className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700"
              >
                Start Renaming Now
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            className="md:w-1/2"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <img
              src="https://via.placeholder.com/400x300"
              alt="Bulk Image Renaming"
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            How It Works
          </motion.h2>
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Steps
              items={[
                {
                  title: "Upload Your Images",
                  description: "Drag and drop or select the folder.",
                  icon: <UploadOutlined />,
                },
                {
                  title: "Set Renaming Rules",
                  description: "Customize how you want your files renamed.",
                  icon: <SettingOutlined />,
                },
                {
                  title: "Hit Rename",
                  description:
                    "Instantly process and download your renamed files.",
                  icon: <ThunderboltOutlined />,
                },
              ]}
            />
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            Benefits
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <BenefitCard
              icon={<ClockCircleOutlined style={{ fontSize: "2rem" }} />}
              title="Save Time"
              description="No more manual renaming one file at a time."
            />
            <BenefitCard
              icon={<AppstoreOutlined style={{ fontSize: "2rem" }} />}
              title="Organized Workflow"
              description="Keep your image library neatly organized with consistent names."
            />
            <BenefitCard
              icon={<SmileOutlined style={{ fontSize: "2rem" }} />}
              title="Simple and Intuitive"
              description="Easy-to-use interface designed for all users."
            />
            <BenefitCard
              icon={<ThunderboltOutlined style={{ fontSize: "2rem" }} />}
              title="Batch Automation"
              description="Automate renaming tasks with one-click execution."
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function BenefitCard({ icon, title, description }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
    >
      <Card className="text-center h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
        <motion.div
          className="mb-4 text-blue-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </Card>
    </motion.div>
  );
}

BenefitCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
