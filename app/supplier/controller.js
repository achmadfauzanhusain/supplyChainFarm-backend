const admin = require("firebase-admin")
const { colSupplier } = require("../../db/firebase") // colSupplier dari Admin SDK
const { ethers } = require("ethers")

module.exports = {
    register: async(req, res) => {
        try {
            const { supplierName, origin, emailSupplier, ethWalletAddress, description, phone } = req.body

            if(!supplierName || !origin || !emailSupplier || !ethWalletAddress || !description || !phone) {
                return res.status(400).json({ message: "All fields are required" })
            }

            if(!ethers.isAddress(ethWalletAddress)) {
                return res.status(400).json({ message: "Invalid Ethereum wallet address" })
            }

            if(/\s/.test(ethWalletAddress)) {
                return res.status(400).json({ message: "Ethereum wallet address cannot contain spaces" })
            }

            // cek duplikat ethWalletAddress
            const querySnapshot = await colSupplier.where("ethWalletAddress", "==", ethWalletAddress).get()
            if (!querySnapshot.empty) {
                return res.status(400).json({ message: "Ethereum wallet address already registered" })
            } else {
                await colSupplier.doc(ethWalletAddress).set({
                    supplierName,
                    origin,
                    emailSupplier,
                    ethWalletAddress,
                    description,
                    phone,
                    status: "unverified",
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                })
                res.status(201).json({ message: "Supplier registered successfully! The administrator must verify your data." })
            }
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" })
        }
    },

    notRegisteredSupplier: async(req, res) => {
        try {
            const querySnapshot = await colSupplier.where("status", "==", "unverified").get()
            const suppliers = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
            res.status(200).json({ data: suppliers })
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" })
        }
    },

    registeredSupplier: async(req, res) => {
        try {
            const querySnapshot = await colSupplier.where("status", "==", "verified").get()
            const suppliers = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
            res.status(200).json({ data: suppliers })
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" })
        }
    },

    detailSupplier: async(req, res) => {
        try {
            const { ethWalletAddress } = req.params
            const docSnapshot = await colSupplier.doc(ethWalletAddress).get()
            if(docSnapshot.exists) {
                res.status(200).json({ data: { ...docSnapshot.data(), id: docSnapshot.id } })
            } else {
                res.status(400).json({ message: "Supplier not found" })
            }
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" })
        }
    },

    changeStatus: async(req, res) => {
        try {
            const { ethWalletAddress } = req.body
            if (!ethWalletAddress) return res.status(400).json({ message: "ethWalletAddress is required" })

            const docRef = colSupplier.doc(ethWalletAddress)
            const docSnapshot = await docRef.get()

            if (!docSnapshot.exists) return res.status(404).json({ message: "Supplier not found" })

            const currentStatus = docSnapshot.data().status
            let newStatus
            if (currentStatus === "unverified") newStatus = "verified"
            else if (currentStatus === "verified") newStatus = "unverified"
            else return res.status(400).json({ message: "Invalid supplier status" })

            await docRef.update({
                status: newStatus,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            })

            res.status(200).json({
                message: `Supplier status updated to ${newStatus}`,
                status: newStatus
            })
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" })
        }
    },

    deleteSupplier: async(req, res) => {
        try {
            const { ethWalletAddress } = req.body
            if (!ethWalletAddress) return res.status(400).json({ message: "ethWalletAddress is required" })

            const docRef = colSupplier.doc(ethWalletAddress)
            const docSnapshot = await docRef.get()
            if (!docSnapshot.exists) return res.status(404).json({ message: "Supplier not found" })

            await docRef.delete()
            res.status(200).json({ message: "Supplier deleted successfully" })
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" })
        }
    },

    searchSupplier: async(req, res) => {
        try {
            const { supplierName } = req.body
            const querySnapshot = await colSupplier
                .where("status", "==", "verified")
                .orderBy("supplierName")
                .startAt(supplierName)
                .endAt(supplierName + "\uf8ff")
                .get()
            
            const results = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
            res.status(200).json({ data: results })
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" })
        }
    }
}
