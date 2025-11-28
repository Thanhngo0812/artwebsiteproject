import { useState } from 'react';

function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Nút mở chatbot */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#0084ff',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '30px'
                }}
            >
                💬
            </button>

            {/* Cửa sổ chat */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '90px',
                    right: '20px',
                    width: '400px',
                    height: '600px',
                    zIndex: 1000,
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    overflow: 'hidden'
                }}>
                    <iframe
                        src="https://chiemtain8n.xiaomichinhhang.vn/webhook/6fcde396-3be9-4793-b4fd-ed91df959bb8/chat"
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none'
                        }}
                        title="Chatbot"
                    />
                </div>
            )}
        </>
    );
}

export default FloatingChatbot;
