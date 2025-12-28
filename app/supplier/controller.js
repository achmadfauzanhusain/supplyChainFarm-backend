const { setDoc, getDocs, doc,
        serverTimestamp, 
        query, where } = require("firebase/firestore")
const { db, colSupplier } = require("../../db/firebase")

module.exports = {
    register: async(req, res) => {
        try {
            const { supplierName, origin, emailSupplier, ethWalletAddress, description } = req.body

            if(!supplierName || !origin || !emailSupplier || !ethWalletAddress || !description) {
                return res.status(400).json({ message: "All fields are required" })
            }

            if(/\s/.test(ethWalletAddress)) {
                return res.status(400).json({ message: "Ethereum wallet address cannot contain spaces" })
            }

            // cek duplikat ethWalletAddress
            const q = query(colSupplier, where("ethWalletAddress", "==", ethWalletAddress))
            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {
                return res.status(400).json({ message: "Ethereum wallet address already registered" })
            } else {
                await setDoc(doc(colSupplier, ethWalletAddress), {
                    supplierName,
                    origin,
                    emailSupplier,
                    ethWalletAddress,
                    description,
                    status: "unverified",
                    createdAt: serverTimestamp(),
                })
                res.status(201).json({ message: "Supplier registered successfully! The administrator must verify your data." })
            }
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" })
        }
    }
}