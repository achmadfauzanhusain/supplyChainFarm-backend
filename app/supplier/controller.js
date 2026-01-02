const { setDoc, getDoc, getDocs, doc, updateDoc,
        onSnapshot,
        serverTimestamp, 
        query, where } = require("firebase/firestore")
const { colSupplier } = require("../../db/firebase")
const { ethers } = require("ethers")

module.exports = {
    register: async(req, res) => {
        try {
            const { supplierName, origin, emailSupplier, ethWalletAddress, description } = req.body

            if(!supplierName || !origin || !emailSupplier || !ethWalletAddress || !description) {
                return res.status(400).json({ message: "All fields are required" })
            }

            if(!ethers.isAddress(ethWalletAddress)) {
                return res.status(400).json({ message: "Invalid Ethereum wallet address" })
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
    },
    notRegisteredSupplier: async (req, res) => {
        try {
            const q = query(colSupplier, where("status", "==", "unverified"))
            let sentResponse = false

            const fetchData = new Promise((resolve, reject) => {
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    if(!sentResponse) {
                        let suppliers = []
                        snapshot.docs.forEach((doc) => {
                            suppliers.push({ ...doc.data(), id: doc.id })
                        })
                        sentResponse = true
                        resolve(suppliers)
                    }
                }, (error) => {
                    reject(error)
                })

                setTimeout(() => {
                    if(!sentResponse) {
                        unsubscribe()
                        reject(new Error("Timeout: Data retrieval took too long"))
                    }
                }, 5000)
            })
            const suppliers = await fetchData
            res.status(200).json({ data: suppliers })
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" })
        }
    },
    registeredSupplier: async (req, res) => {
        try {
            const q = query(colSupplier, where("status", "==", "verified"))
            let sentResponse = false

            const fetchData = new Promise((resolve, reject) => {
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    if(!sentResponse) {
                        let suppliers = []
                        snapshot.docs.forEach((doc) => {
                            suppliers.push({ ...doc.data(), id: doc.id })
                        })
                        sentResponse = true
                        resolve(suppliers)
                    }
                }, (error) => {
                    reject(error)
                })

                setTimeout(() => {
                    if(!sentResponse) {
                        unsubscribe()
                        reject(new Error("Timeout: Data retrieval took too long"))
                    }
                }, 5000)
            })
            const suppliers = await fetchData
            res.status(200).json({ data: suppliers })
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" })
        }
    },
    detailSupplier: async (req, res) => {
        try {
            const { ethWalletAddress } = req.params
            const docRef = doc(colSupplier, ethWalletAddress)

            const docSnapshot = await getDoc(docRef)
            if(docSnapshot.exists()) {
                const supplierData = { ...docSnapshot.data(), id: docSnapshot.id }
                res.status(200).json({ data: supplierData })
            } else {
                res.status(400).json({ message: "Supplier not found" })
            }
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal server error" })
        }
    },
    changeStatus: async (req, res) => {
        try {
            const { ethWalletAddress } = req.body

            if (!ethWalletAddress) {
                return res.status(400).json({ message: "ethWalletAddress is required" })
            }

            const docRef = doc(colSupplier, ethWalletAddress)
            const docSnapshot = await getDoc(docRef)

            if (!docSnapshot.exists()) {
                return res.status(404).json({ message: "Supplier not found" })
            }

            const currentStatus = docSnapshot.data().status

            let newStatus
            if (currentStatus === "unverified") {
                newStatus = "verified"
            } else if (currentStatus === "verified") {
                newStatus = "unverified"
            } else {
                return res.status(400).json({ message: "Invalid supplier status" })
            }

            await updateDoc(docRef, {
                status: newStatus,
                updatedAt: serverTimestamp()
            })

            res.status(200).json({
                message: `Supplier status updated to ${newStatus}`,
                status: newStatus
            })

        } catch (error) {
            res.status(500).json({ message: error.message || "Internal server error" })
        }
    }
}