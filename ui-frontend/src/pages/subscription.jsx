import MainLayout from "../layouts/mainLayout";
import SubscriptionCard from "../components/subscriptionCard";
import LayoutHeader from "../components/layoutHeader";
import illustration from "../assets/subscriptionIllustration.svg"
export default function Subscription() {
    const subscriptionList = [
        {
            name: "Free",
            illustration: illustration,
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem fugit nesciunt deserunt iusto. Architecto esse similique beatae deleniti quos vitae harum perspiciatis sapiente? Sed fugit saepe pariatur ducimus doloremque expedita.",
            price: "price"
        },
        {
            name: "Free",
            illustration: illustration,
            text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem fugit nesciunt deserunt iusto. Architecto esse similique beatae deleniti quos vitae harum perspiciatis sapiente? Sed fugit saepe pariatur ducimus doloremque expedita.",
            price: "price"
        }
    ]
    return <MainLayout child={
        <main className="flex-1 p-8 overflow-y-auto">
            <LayoutHeader layoutName={"Subscription"}></LayoutHeader>
            <div className="m-2 ">
                Actual subscription : Free
            </div>
            <div className="flex flex-wrap justify-center">
                {subscriptionList.map((item, id) => <SubscriptionCard key={item.name + "" + id} name={item.name} illustration={item.illustration} text={item.text} price={item.price} />)}
            </div>
        </main>
    }></MainLayout>
}