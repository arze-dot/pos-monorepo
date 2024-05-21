import { useEffect, useRef, useState } from "react"
import { getOrder, updateOrder } from "../../api/order/orderApi"
import Button from "../../components/button/Button"
import { checkOrderItem } from "../../api/orderItems/orderItemsApi"
import { motion } from 'framer-motion'
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react/dist/iconify.js"

function OutstandingOrderPage() {

    const [order, setOrder] = useState([])
    const [orderItem, setOrderItem] = useState([])
    const [detailOpen, setDetailOpen] = useState(false)
    const [orderId, setOrderId] = useState(null)
    const [fetch, setFetch] = useState(true)

    const [loadingPaid, setLoadingPaid] = useState(false)

    const modalDetailRef = useRef(null);

    const navigate = useNavigate()

    const handleOutsideClickDetail = (event) => {
        if (modalDetailRef.current && !modalDetailRef.current.contains(event.target)) {
            setDetailOpen(false);
        }
    };

    const orderGet = async () => {
        const response = await getOrder(localStorage.getItem('token'))
        setOrder(response.reverse())
        setFetch(false)
    }

    useEffect(() => {
        if (fetch) {
            orderGet()
        }
    }, [])

    const orderItemCheck = async (item) => {
        const response = await checkOrderItem(localStorage.getItem('token'), { orderId: item.id })
        if (response.status) {
            setOrderId(item.id)
            setOrderItem(response.data)
            setDetailOpen(true)
        }
    }

    const paidOrder = async () => {
        const updateStatus = await updateOrder(localStorage.getItem('token'), { status: 2 }, orderId)
        if (updateStatus.status) {
            setDetailOpen(false)
            setFetch(true)
        }
    }
    return (
        <div className="w-full max-w-[400px] flex p-7 flex-col items-start justify-start gap-4">
            <div className="font-bold flex gap-3 items-center">
                <Icon icon="emojione:left-arrow" fontSize={24} onClick={() => navigate(-1)} />
                OUTSTANDING ORDER
            </div>
            {/* Card */}
            <div className="max-h-[750px] overflow-y-auto w-full flex items-start justify-start flex-col gap-5">
                {
                    order.map((item, index) => {
                        return (
                            <div className="w-full p-3 border rounded-md" key={index} onClick={() => orderItemCheck(item)}>
                                <p>Customer Name : {item.customerName}</p>
                                <p>Total Price : {parseInt(item.totalPrice).toLocaleString("id", { style: "currency", currency: "IDR" })}</p>
                                {
                                    parseInt(item.status) === 1 && <p className="font-bold text-red-500">Status: NOT PAID</p>
                                }
                                {
                                    parseInt(item.status) === 2 && <p className="font-bold text-blue-900">Status: PAID</p>
                                }
                            </div>
                        )
                    })

                }
            </div>

            {
                detailOpen && (

                    <div className="absolute inset-0 bg-white backdrop-blur-sm bg-opacity-50 z-40 w-screen h-screen flex items-center justify-center"
                        onClick={handleOutsideClickDetail}
                    >
                        <motion.div
                            id="dialog-create-user"
                            animate={{ bottom: detailOpen ? 400 : '-50%' }}
                            className={
                                " w-[380px] min-h-[320px] text-black " +
                                "flex flex-col items-center justify-center gap-[40px] p-[24px] " +
                                " rounded-md "
                            }
                            onClick={(e) => e.stopPropagation()}
                            ref={modalDetailRef}
                        >
                            <div className="w-full bg-white p-5 border-2 rounded-md">
                                Detail Summary

                                <div className="w-full max-h-[300px] overflow-y-auto">
                                    {orderItem.map((item) => {
                                        return (
                                            <div className="border-b py-2">
                                                <p className="font-bold">{item.name}</p>
                                                <p>{item.priceJual.toLocaleString("id", { style: "currency", currency: "IDR" })} x {item.quantity} = {(parseInt(item.priceJual) * parseInt(item.quantity)).toLocaleString("id", { style: "currency", currency: "IDR" })}</p>
                                            </div>
                                        )
                                    })}
                                </div>

                                <Button className='mt-2' onClick={() => paidOrder()} loading={loadingPaid}>Paid</Button>
                                <Button className='mt-2' onClick={() => navigate(`/order/${orderId}`)}>Tambah Item</Button>
                                <Button className='mt-2' onClick={() => setDetailOpen(false)}>Cancel</Button>
                            </div>
                        </motion.div>
                    </div>
                )
            }
        </div>
    )
}

export default OutstandingOrderPage