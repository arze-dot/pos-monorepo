import { useEffect, useRef, useState } from "react"
import { motion } from 'framer-motion'
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { createInventory, getInventory, updateInventory } from "../../api/inventory/inventoryApi";
import Select from "../../components/input/Select";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";

function InventoryPage() {

    const navigate = useNavigate()
    const modalRef = useRef(null);
    const modalEditRef = useRef(null);
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [formTambah, setFormTambah] = useState({
        name: '',
        idKategori: '',
        quantity: '',
        priceJual: ''
    })
    const [formEdit, setFormEdit] = useState({
        id: '',
        name: '',
        idKategori: '',
        quantity: '',
        priceJual: ''
    })
    const [fetch, setFetch] = useState(true)
    const [addDisabled, setAddDisabled] = useState(false)
    const [editDisabled, setEditDisabled] = useState(false)

    const [filter, setFilter] = useState('')

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

    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setOpen(false);
        }
    };

    const handleOutsideClickEdit = (event) => {
        if (modalEditRef.current && !modalEditRef.current.contains(event.target)) {
            setOpenEdit(false);
        }
    };

    const handleChange = (e) => {
        setFormTambah({
            ...formTambah,
            [e.target.name]: e.target.value
        })
    }

    const tambahStock = async () => {
        setAddDisabled(true)
        const data = {
            name: formTambah.name,
            idKategori: parseInt(formTambah.idKategori),
            quantity: parseInt(formTambah.quantity),
            priceJual: parseInt(formTambah.priceJual)
        }
        const response = await createInventory(localStorage.getItem('token'), data);
        if (response.status) {
            setFetch(true)
            setOpen(false)
        }
        setAddDisabled(false)
    }

    const openEditInventory = (data) => {
        setOpenEdit(true)
        setFormEdit(data)
    }

    const handleChangeEdit = (e) => {
        setFormEdit({
            ...formEdit,
            [e.target.name]: e.target.value
        })
    }

    const editInventory = async () => {
        setEditDisabled(true)
        const data = {
            name: formEdit.name,
            idKategori: parseInt(formEdit.idKategori),
            quantity: parseInt(formEdit.quantity),
            priceJual: parseInt(formEdit.priceJual)
        }
        const response = await updateInventory(localStorage.getItem('token'), data, formEdit.id);
        if (response.status) {
            setFetch(true)
            setOpenEdit(false)
        }
        setEditDisabled(false)
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-blue-400 to-teal-400 justify-center items-start">
            <div className="max-w-[400px] w-[400px] p-5 bg-white relative" >
                <div className="font-bold flex items-center gap-3">
                    <Icon icon="emojione:left-arrow" fontSize={24} onClick={() => navigate(-1)} />
                    Inventory
                </div>
                <div className="w-full mt-5">
                    <Input placeholder='Search ' className='mt-2' onChange={(e) => setFilter(e.target.value.toLowerCase())} />
                </div>
                {/* Menu Page */}
                <div className="mt-5 flex flex-row items-start justify-start gap-5 flex-wrap pb-[50px]">
                    {
                        inventory.filter((e) => filter === '' ? e : e.name.toLowerCase().includes(filter)).reverse().slice(0, 10).map((item, index) => {
                            return (
                                <div className="w-full rounded-lg border shadow-sm cursor-pointer hover:shadow-lg" key={index} onClick={() => openEditInventory(item)}>
                                    <div className="p-2 flex flex-col items-start justify-start gap-2">
                                        <p className={`min-w-[150px] ${item.idKategori === 1 ? 'bg-blue-400' : 'bg-red-400'}  p-1 px-2 rounded-md`}>{item.name}</p>
                                        <p>Stock : {item.quantity}</p>
                                        <p>Harga Jual : Rp. {item.priceJual.toLocaleString("id", { style: "currency", currency: "IDR" })}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                <div className="fixed bottom-0 w-full p-3 bg-white -left-[0px]" >
                    <Button onClick={() => setOpen(true)}>
                        Tambah Inventory
                    </Button>
                </div>
                {/* Modal */}
                {
                    open && (

                        <div className="absolute inset-0 bg-white backdrop-blur-sm bg-opacity-50 z-40 w-screen h-screen flex items-center justify-center max-w-[400px]"
                            onClick={handleOutsideClick}
                        >
                            <motion.div
                                id="dialog-create-user"
                                animate={{ bottom: open ? 400 : '-50%' }}
                                className={
                                    " w-[380px] max-w-[380px] text-black " +
                                    "flex flex-col items-center justify-center gap-[40px] p-[24px] " +
                                    " rounded-md "
                                }
                                onClick={(e) => e.stopPropagation()}
                                ref={modalRef}
                            >
                                <div className="w-full p-4 bg-white rounded-md border-2 ">
                                    <p className="border-b border-black pb-2">TAMBAH INVENTORY</p>
                                    <div className="flex flex-col items-start justify-start gap-4 mt-3">
                                        <Input label={'Nama'} name='name' onChange={handleChange} />
                                        <Select name='idKategori' onChange={handleChange} options={[
                                            {
                                                value: '',
                                                label: 'Pilih Kategori'
                                            },
                                            {
                                                value: '1',
                                                label: 'Minuman'
                                            },
                                            {
                                                value: '2',
                                                label: 'Makanan'
                                            },
                                        ]} />
                                        <Input label={'Quantity'} type={'number'} name='quantity' onChange={handleChange} />
                                        <Input label={'Price Jual'} type={'number'} name='priceJual' onChange={handleChange} />
                                        <Button onClick={() => tambahStock()} loading={addDisabled}>
                                            Tambah
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )
                }

                {
                    openEdit && (

                        <div className="absolute inset-0 bg-white backdrop-blur-sm bg-opacity-50 z-40 w-screen h-screen flex items-center justify-center max-w-[400px]"
                            onClick={handleOutsideClickEdit}
                        >
                            <motion.div
                                id="dialog-create-user"
                                animate={{ bottom: open ? 400 : '-50%' }}
                                className={
                                    " w-[380px] max-w-[380px] min-h-[320px] text-black " +
                                    "flex flex-col items-center justify-center gap-[40px] p-[24px] " +
                                    " rounded-md "
                                }
                                onClick={(e) => e.stopPropagation()}
                                ref={modalEditRef}
                            >
                                <div className="w-full p-4 bg-white rounded-md ">
                                    <p>Update Inventory</p>
                                    <div className="flex flex-col items-start justify-start gap-4 mt-6">
                                        <Input label={'Nama'} name='name' onChange={handleChangeEdit} value={formEdit.name} />
                                        <Select name='idKategori' onChange={handleChangeEdit} options={[
                                            {
                                                value: '',
                                                label: 'Pilih Kategori'
                                            },
                                            {
                                                value: '1',
                                                label: 'Minuman'
                                            },
                                            {
                                                value: '2',
                                                label: 'Makanan'
                                            },
                                        ]}
                                            value={formEdit.idKategori}
                                        />
                                        <Input label={'Quantity'} type={'number'} name='quantity' onChange={handleChangeEdit} value={formEdit.quantity} />
                                        <Input label={'Price Jual'} type={'number'} name='priceJual' onChange={handleChangeEdit} value={formEdit.priceJual} />
                                        <Button onClick={() => editInventory()} loading={editDisabled}>
                                            Update
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )
                }

            </div>

        </div>
    )
}

export default InventoryPage