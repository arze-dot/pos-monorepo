import { Icon } from "@iconify/react/dist/iconify.js"
import { Link } from "react-router-dom"

function HomePage() {
    return (
        <div className="flex h-screen bg-gradient-to-br from-blue-400 to-teal-400 justify-center items-start">
            <div className="max-w-[400px] w-[400px] p-5 bg-white relative h-screen" >
                <div className="font-bold">
                    Home
                </div>

                <div className="mt-[50px] p-2 w-full flex flex-col gap-5">
                    <Link to={'/outstanding-order'} className="w-full">
                        <div className="w-full p-3 border rounded-lg flex gap-5">
                            <p><Icon icon="icon-park:order" fontSize={50} /></p>
                            <div>
                                <p>Outstanding Order</p>
                                <p className="text-gray-500 text-[12px]">Check order status!</p>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/order'} className="w-full">
                        <div className="w-full p-3 border rounded-lg flex gap-5">
                            <p><Icon icon="icon-park-twotone:order" fontSize={50} /></p>
                            <div>
                                <p>Order</p>
                                <p className="text-gray-500 text-[12px]">Create new order!</p>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/inventory'} className="w-full">
                        <div className="w-full p-3 border rounded-lg flex gap-5">
                            <p><Icon icon="material-symbols:inventory-2" fontSize={50} /></p>
                            <div>
                                <p>Inventory</p>
                                <p className="text-gray-500 text-[12px]">Manage your inventory!</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default HomePage