import MainLayout from "../layouts/mainLayout";
import SubscriptionCard from "../components/subscriptionCard";
import LayoutHeader from "../components/layoutHeader";
import illustration from "../assets/subscriptionIllustration.svg"
import { useEffect, useState } from "react";
import { GoApp } from "../services/bridge";
export default function Subscription() {
    const [subscription, setSubscription] = useState("free")
    useEffect(() => {
        const checkToken = async () => {
            const res = await GoApp.checkToken()
            console.log(res)
            setSubscription(res)
        }
        checkToken()
    }, [])
    const subscriptionList = [
        {
            name: "Free",
            illustration: illustration,
            text: "This include the basic functionnalities for beginners. But with limited access",
            price: "free"
        },
        {
            name: "Pro",
            illustration: illustration,
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem fugit nesciunt deserunt iusto. Architecto esse similique beatae deleniti quos vitae harum perspiciatis sapiente? Sed fugit saepe pariatur ducimus doloremque expedita.",
            price: "price"
        }
    ]
    return <MainLayout child={
        <main className="flex-1 p-8 overflow-y-auto">
            <div className="sticky top-0 mt-2 bg-couleur3 pb-2">
                <LayoutHeader layoutName={"Subscription"}></LayoutHeader>
            </div>
            <div className="m-2 ">
                <div>
                    Actual subscription : <span>{subscription.subscription}</span>
                </div>
                <div>
                    Start date : <span>{subscription.iat}</span>
                </div>
                <div>
                    Expiration date : <span> {subscription.exp}</span>
                </div>
            </div>
            <div className="flex flex-wrap justify-center">
                {subscriptionList.map((item, id) => <>
                {item.name .toLowerCase() != subscription.subscription && <SubscriptionCard key={item.name + "" + id} name={item.name} illustration={item.illustration} text={item.text} price={item.price} />}</>)}
            </div>
        </main>
    }></MainLayout>
}