import React, { useEffect, useRef, useState } from 'react'
import { BsEmojiSmileFill } from "react-icons/bs"
import { ImAttachment } from "react-icons/im"
import EmojiPicker, { EmojiStyle, EmojiClickData } from 'emoji-picker-react';
type propType = {
    setInputMessage: React.Dispatch<React.SetStateAction<string>>,
    onMessageSubmit: () => void,
    inputMessage: string,
    onEmojiSelect: (e: EmojiClickData) => void
}
function InputMessageBox({ setInputMessage, onMessageSubmit, inputMessage, onEmojiSelect }: propType) {
    const [emojiPickerShow, setShowEmojiPicker] = useState<boolean>(false)
    const divRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
      function handleClickOutside(event:any) {
        if (divRef.current && !divRef.current.contains(event.target)) {
            setShowEmojiPicker(false)
        }
      }
  
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, [divRef]);
    return (
        <footer className={`footer_section px-2 ${emojiPickerShow ? "py-0" : "py-2"}`}>
            <div ref={divRef} className="input_field relative text-[1.2rem]">
                <input type="text" name="" placeholder='write message...' className={`w-full rounded-md py-3 indent-3 font-inter outline-none pr-[5.1rem] ${emojiPickerShow?"rounded-b-none":""}`}
                    value={inputMessage}
                    onChange={(e) => {
                        setInputMessage(e.target.value)
                    }}
                    onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            onMessageSubmit()
                        }
                    }}
                    id="" />
                <div className="icons absolute top-[5px] right-1 rounded-md">
                    <button className='text-[1.2rem] hover:bg-[#d1c9c98c] p-2 rounded-full'
                        onClick={() => {
                            setShowEmojiPicker(!emojiPickerShow)
                        }}
                    >
                        <BsEmojiSmileFill className='text-[1.4rem] text-[#eca415]' />
                    </button>
                    <button className='text-[1.2rem] hover:bg-[#d1c9c98c] p-2 rounded-full'>
                        <ImAttachment className='text-[1.4rem]' />
                    </button>
                </div>
                {emojiPickerShow && <div  className="emoji_picker w-full">
                    <EmojiPicker
                        lazyLoadEmojis={true}
                        emojiStyle={EmojiStyle.FACEBOOK}
                        width="100%"
                        onEmojiClick={onEmojiSelect}
                        height="28rem"
                    />
                </div>}
            </div>
        </footer>
    )
}

export default InputMessageBox