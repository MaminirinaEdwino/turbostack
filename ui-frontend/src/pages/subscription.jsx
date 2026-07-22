import MainLayout from "../layouts/mainLayout";
import SubscriptionCard from "../components/subscriptionCard";
import LayoutHeader from "../components/layoutHeader";
import illustration from "../assets/subscriptionIllustration.svg"
import { useEffect, useState } from "react";
import { GoApp } from "../services/bridge";
export default function Subscription() {
    const [subscription, setSubscription] = useState("free")
    const [toggleKeyModal, setToggleKeyModal] = useState(false)
    const [activationKey, setActivationKey] = useState("")
    const checkToken = async () => {
            const res = await GoApp.checkToken()
            console.log(res)
            setSubscription(res)
        }
    const saveToken = async () => {
        await GoApp.saveToken(activationKey)
        checkToken()
    }
    useEffect(() => {
        const checkToken = async () => {
            const res = await GoApp.checkToken()
            console.log(res)
            setSubscription(res)
        }
        checkToken()
    }, [])
    const subscriptionList = [
        // {
        //     name: "Free",
        //     illustration: illustration,
        //     text: "This include the basic functionnalities for beginners. But with limited access",
        //     price: "free"
        // },
        {
            name: "Pro",
            illustration: illustration,
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem fugit nesciunt deserunt iusto. Architecto esse similique beatae deleniti quos vitae harum perspiciatis sapiente? Sed fugit saepe pariatur ducimus doloremque expedita.",
            price: "Activate"
        }
    ]
    return <MainLayout child={
        <main className="flex-1 p-8 overflow-y-auto">
            <div className="sticky top-0 mt-2 bg-couleur3 pb-2">
                <LayoutHeader layoutName={"Subscription"}></LayoutHeader>
            </div>
            <div className={"h-fit rounded shadow-2xl w-[80vw] p-3 box-border flex flex-col fixed bg-couleur3 border border-couleur1/50 z-10 transition-all duration-500 " + (!toggleKeyModal ? "hidden" : "")} >
                <h3 className="text-xl text-center text-couleur1 ">Add your activation key</h3>
                <textarea name="" id="" className="border border-couleur1/50 rounded  box-border min-h-56 resize-none p-1" value={activationKey} onChange={(e) => setActivationKey(e.target.value)}></textarea>
                <div className="flex gap-2">
                    {activationKey != "" && <button className="bg-couleur1 w-fit px-4 py-2 rounded my-1 text-white hover:bg-couleur1/80 shadow-2xl shadow-couleur2/50 transition-all duration-300" onClick={() => {
                        saveToken()
                    }}>Activate</button>}
                    <button className="bg-white w-fit px-4 py-2 rounded my-1 text-couleur1 hover:bg-couleur1/80 shadow-2xl shadow-couleur2/50 transition-all duration-300 hover:text-white border border-couleur1/80 " onClick={() => setToggleKeyModal(false)}>Cancel</button>
                </div>
            </div>
            {subscription.expired == "false" ? <div className="m-2 ">
                <div>
                    Actual subscription : <span>{subscription.subscription}</span>
                </div>
                <div>
                    Start date : <span>{subscription.iat}</span>
                </div>
                <div>
                    Expiration date : <span> {subscription.exp}</span>
                </div>
            </div> :
                <div className="flex flex-wrap justify-center">
                    {subscriptionList.map((item, id) => <>
                        {item.name.toLowerCase() != subscription.subscription && <SubscriptionCard setTogglekeyModal={setToggleKeyModal} key={item.name + "" + id} name={item.name} illustration={item.illustration} text={item.text} price={item.price} />}</>)}
                </div>}
        </main>
    }></MainLayout>
}