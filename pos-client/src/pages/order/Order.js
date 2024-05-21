import { useEffect, useRef, useState } from "react"
import { motion } from 'framer-motion'
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { getInventory } from "../../api/inventory/inventoryApi";
import { Icon } from "@iconify/react/dist/iconify.js";
import { checkPendingOrder, confirmationOrder, createOrder, detailOrder, updateOrder } from "../../api/order/orderApi";
import { checkOrderItem, createOrderItem } from "../../api/orderItems/orderItemsApi";
import { useNavigate, useParams } from "react-router-dom";

function OrderPage() {
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [inventory, setInventory] = useState([]);
    const [fetch, setFetch] = useState(true)

    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [loadingConfirm, setLoadingConfirm] = useState(false)

    const navigate = useNavigate()

    const modalRef = useRef(null);
    const modalDetailRef = useRef(null);
    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setOpen(false);
        }
    };
    const handleOutsideClickDetail = (event) => {
        if (modalDetailRef.current && !modalDetailRef.current.contains(event.target)) {
            setDetailOpen(false);
        }
    };

    const [orderItem, setOrderItem] = useState({
        inventoryId: '',
        quantity: 0
    })

    const [orderItems, setOrderItems] = useState([])
    const [order, setOrder] = useState({
        customerName: '',
    })

    const [isPendingOrder, setPendingOrder] = useState(false)
    const checkOrder = async () => {
        const pendingOrder = await checkPendingOrder(localStorage.getItem('token'))
        if (pendingOrder.found) {
            setPendingOrder(true)
            setOrder(pendingOrder.order)
        }
    }

    const getDetailOrder = async () => {
        const orderDetail = await detailOrder(localStorage.getItem('token'), id)
        setOrder(orderDetail)
        setPendingOrder(true)
    }
    useEffect(() => {
        if (id) {
            getDetailOrder()
        } else {
            checkOrder()
        }
    }, [])
    const inventoryGet = async () => {
        const data = await getInventory(localStorage.getItem('token'));
        setInventory(data)
        setFetch(false)
    }

    useEffect(() => {
        if (fetch) {
            inventoryGet()
        }
    }, [fetch])

    const modalItemSubmit = (data) => {
        setOrderItem({
            quantity: 0,
            name: data.name,
            inventoryId: data.id,
        })
        setOpen(true)
    }
    const submitItem = async () => {
        setLoadingSubmit(true)
        setOrder({
            ...order,
        })
        if (!isPendingOrder) {
            const response = await createOrder(localStorage.getItem('token'), {
                ...order,
                totalPrice: 0,
                status: 0
            })
            if (response.status) {
                const orderItemCreate = await createOrderItem(localStorage.getItem('token'), { ...orderItem, orderId: response.data.id })
                if (orderItemCreate.status) {
                    const responseOrderItem = await checkOrderItem(localStorage.getItem('token'), { orderId: response.data.id })
                    if (responseOrderItem.status) {
                        setPendingOrder(true)
                        setOrderItems(responseOrderItem.data)
                        let totalPrice = 0;
                        responseOrderItem.data.map((item) => {
                            totalPrice += parseInt(item.priceJual) * parseInt(item.quantity)
                        })
                        const updateTotalPrice = await updateOrder(localStorage.getItem('token'), { totalPrice: totalPrice }, response.data.id)
                        if (updateTotalPrice.status) {
                            setOrder({
                                ...order,
                                ...response.data,
                                totalPrice: totalPrice
                            })
                            setFetch(true)
                        }
                    }
                }
            }
        } else {
            const orderItemCreate = await createOrderItem(localStorage.getItem('token'), { ...orderItem, orderId: order.id })
            if (orderItemCreate.status) {
                const responseOrderItem = await checkOrderItem(localStorage.getItem('token'), { orderId: order.id })
                if (responseOrderItem.status) {
                    setOrderItems(responseOrderItem.data)
                    let totalPrice = 0;
                    responseOrderItem.data.map((item) => {
                        totalPrice += parseInt(item.priceJual) * parseInt(item.quantity)
                    })
                    const updateTotalPrice = await updateOrder(localStorage.getItem('token'), { totalPrice: totalPrice }, order.id)
                    if (updateTotalPrice.status) {
                        setOrder({
                            ...order,
                            totalPrice: totalPrice
                        })
                        setFetch(true)
                    }
                    setFetch(true)
                }
            }
        }

        setLoadingSubmit(false)
        setOpen(false)
    }

    const openDetailOrderItem = async () => {
        const response = await checkOrderItem(localStorage.getItem('token'), { orderId: order.id })
        if (response.status) {
            setOrderItems(response.data)
            setDetailOpen(true)
        }
    }

    const confirmOrder = async () => {
        const orderConfirm = await confirmationOrder(localStorage.getItem('token'), order.id)
        if (orderConfirm.status) {
            navigate('/home')
        }
    }

    const [filter, setFilter] = useState('')

    return (
        <div className="flex h-screen bg-gradient-to-br from-blue-400 to-teal-400 justify-center items-start">
            <div className="max-w-[400px] w-[400px] p-5 bg-white relative" >
                <div className="font-bold flex gap-3 items-center">
                    <Icon icon="emojione:left-arrow" fontSize={24} onClick={() => navigate(-1)} />

                    ORDER
                </div>

                <div className="w-full mt-5">
                    <Input placeholder='Search ' className='mt-2' onChange={(e) => setFilter(e.target.value.toLowerCase())} />
                </div>
                {/* Menu Page */}
                <div className="mt-5 flex flex-row items-start justify-start gap-2 flex-wrap pb-[100px]">
                    {
                        inventory.filter((e) => filter === '' ? e : e.name.toLowerCase().includes(filter)).reverse().slice(0, 10).map((item, index) => {
                            return (
                                <div className="w-full flex justify-between items-center pl-5 pr-9 rounded-lg border shadow-sm cursor-pointer hover:shadow-lg" onClick={() => modalItemSubmit(item)} key={index}>
                                    <div>
                                        <div className="p-1">
                                            <p>{item.name}</p>
                                        </div>
                                        <div className="p-1">
                                            Stock : {item.quantity}
                                        </div>
                                        <div className="p-1">
                                            Harga : {item.priceJual}
                                        </div>
                                    </div>
                                    {
                                        item.idKategori === 1 ?
                                            <Icon icon="icon-park:tea-drink" fontSize={48} />
                                            :
                                            <Icon icon="twemoji:pot-of-food" fontSize={48} />
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                {/* Modal */}
                {
                    open && (

                        <div className="absolute inset-0 bg-white backdrop-blur-sm bg-opacity-50 z-40 w-screen h-screen flex items-center justify-center"
                            onClick={handleOutsideClick}
                        >
                            <motion.div
                                id="dialog-create-user"
                                animate={{ bottom: open ? 400 : '-50%' }}
                                className={
                                    " w-[380px] min-h-[320px] text-black " +
                                    "flex flex-col items-center justify-center gap-[40px] p-[24px] " +
                                    " rounded-md "
                                }
                                onClick={(e) => e.stopPropagation()}
                                ref={modalRef}
                            >
                                <div className="w-full bg-white p-5 border-2 rounded-md">
                                    Order Summary

                                    <div className='w-full flex flex-col items-start justify-start gap-3 mt-3'>
                                        {

                                            <Input placeholder='Customer Name' onChange={(e) => setOrder({
                                                ...order,
                                                customerName: e.target.value
                                            })} disabled={isPendingOrder} value={order.customerName} />

                                        }
                                        <Input placeholder='Item Name' value={orderItem.name} disabled />
                                        <Input placeholder='Jumlah' type='number' value={orderItem.quantity} onChange={(e) => setOrderItem({
                                            ...orderItem,
                                            quantity: e.target.value
                                        })} />
                                    </div>

                                    <Button className='mt-2' onClick={() => submitItem()} disabled={orderItem.quantity === 0} loading={loadingSubmit}>Submit</Button>
                                </div>
                            </motion.div>
                        </div>
                    )
                }

            </div>
            {
                isPendingOrder &&
                <div className="fixed bottom-0 h-[70px] bg-white shadow-xl w-full max-w-[400px] border-t-2 flex p-5 justify-between">
                    <div>
                        {order.customerName} : {order.totalPrice?.toLocaleString("id", { style: "currency", currency: "IDR" })}

                    </div>
                    <div className="w-[100px] -mt-2">
                        <Button onClick={() => openDetailOrderItem()}>
                            Detail
                        </Button>
                    </div>
                </div>
            }

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

                                <div className="">
                                    {orderItems.map((item) => {
                                        return (
                                            <div className="border-b py-2">
                                                <p className="font-bold">{item.name}</p>
                                                <p>{item.priceJual.toLocaleString("id", { style: "currency", currency: "IDR" })} x {item.quantity} = {(parseInt(item.priceJual) * parseInt(item.quantity)).toLocaleString("id", { style: "currency", currency: "IDR" })}</p>
                                            </div>
                                        )
                                    })}
                                </div>

                                <Button className='mt-2' onClick={() => confirmOrder()} loading={loadingConfirm}>Submit</Button>
                            </div>
                        </motion.div>
                    </div>
                )
            }
        </div>
    )
}

export default OrderPage