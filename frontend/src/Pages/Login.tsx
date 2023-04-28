import { useNavigate } from 'react-router-dom'
import { FcGoogle } from "react-icons/fc"
import { FaFacebookF } from "react-icons/fa"
interface loginProviderInterface { id: number, name: string, path: string, icon: JSX.Element }
const loginProvider: loginProviderInterface[] = [
    {
        id: 1,
        name: "Gmail",
        path: "http://localhost:8080/api/v1/login/google",
        icon: <FcGoogle className='text-[1.7rem]' />
    },
    {
        id: 2,
        name: "Facebook",
        path: "/fb",
        icon: <FaFacebookF className='text-[1.7rem]' />
    },
]
function Login() {
    const navigate = useNavigate()
    return (
        <div className='w-screen h-screen'>
            <div className="wrapper_login_provider h-full flex justify-center items-center">
                <div className="card_login bg-[#1320d65e] pb-[3rem] pt-[2rem] w-[34rem] gap-y-[2rem] flex flex-col rounded-md px-4 border-[1px] border-[#0e07e5e2] drop-shadow-md">
                    <div className="wrappername w-full flex justify-center items-center">
                        <p className='text-[#fff] text-[1.5rem] font-inter tracking-wider font-medium divide-solid divide-x-2'>login</p>
                    </div>
                    {
                        loginProvider.map((item: loginProviderInterface) => {
                            return <div key={item.id} className="input1 p-2 bg-[#5c5ef9] rounded-md">
                                <button
                                    onClick={() => {
                                        window.location.href=item.path
                                    }}
                                    className='btn btn-block text-[#fbf9f9] bg-[#1b03b4] border-none outline-none hover:bg-[#020e3b] hover:text-[#fff] font-inter tracking-wider
                                    text-[1.2rem]
                                    '> <span className={`${item.id === 1 ? "pr-[2.8rem]" : "pr-6"}`}>{item.icon}</span>{item.name}</button>
                            </div>
                        })
                    }

                </div>
            </div>
        </div>
    )
}

export default Login