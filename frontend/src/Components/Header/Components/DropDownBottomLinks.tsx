type propType = {
    item: {
        id: number,
        name: string,
        icon: JSX.Element,

    },
    callback: (e: number) => void
}
function DropDownBottomLinks({ item, callback }: propType) {
    return (
        <div key={item.id} className="profile cursor-pointer  px-2 py-1 border-b-[1px] border-b-solid border-[#bbb5b5]">
            <div className="wrapperlinks flex justify-start items-center gap-x-2 hover:bg-[#dad4d4] rounded-md pl-3">
                <div className="icon hover:text-[#000000] text-[#fff]">{item.icon}</div>
                <div role="button"
                    onClick={() => {
                        callback(item.id)
                    }}
                    className="profile_name text-[1.4rem] tracking-wider hover:text-[#000000] text-[#fff]">{item.name}</div>
            </div>
        </div>
    )
}

export default DropDownBottomLinks