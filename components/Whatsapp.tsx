import { IconBrandWhatsapp } from '@tabler/icons-react';
import Link from 'next/link';

function Whatsapp() {
    return (
        
		<Link passHref href="https://api.whatsapp.com/send?phone=919211619009"><div className="z-40" style={{position: 'fixed', bottom: 110, right: 36, cursor: 'pointer'}}>
        	<IconBrandWhatsapp target="_blank" style={{background: '#25d366',
			 color: 'white', zIndex: 9, height: 50, width: 50,
			 borderRadius: 9,
			 padding:'7px'}}/><span className="absolute right-0 top-0 rounded-2xl animate-ping w-full h-full ring-2 ring-green-300">
			 </span>
        	</div>
			</Link>
    )
}

export default Whatsapp;