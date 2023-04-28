import React, { useEffect, useRef, useState } from 'react'
import Message from './Message'

type propType = { allMessage: string[] }
function MessageReaderBox({ allMessage }: propType) {
    const scrollbarRef = useRef<HTMLDivElement>(null)
    const messageBoxRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (scrollbarRef.current && messageBoxRef.current) {
            scrollbarRef.current.scrollTop = messageBoxRef.current.offsetHeight + messageBoxRef.current.offsetTop;
        }
    }, [allMessage])
    return (
        <main ref={scrollbarRef} className="mid_section flex-1  bg-[#030548] overflow-y-scroll" id="messageBoxScrollbar">
            {allMessage.length > 0 && allMessage.map((item) => {
                return <Message msg={item} messageBoxRef={messageBoxRef}/>
            })}
        </main>
    )
}

export default MessageReaderBox;