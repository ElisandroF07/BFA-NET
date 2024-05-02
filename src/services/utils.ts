class utils {
    addOneDay(timestamp: string) {
        const data = new Date(parseInt(timestamp));
        data.setHours(data.getHours() + 24);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const hora = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}/${ano} - ${hora}:${minutos}`;
    }

    formatWithHours(timestamp: string) {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
    
        const date = new Date(parseInt(timestamp));
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
    
        return `${day} ${month} ${year} - ${hours}:${minutes}`;
    }

    formatWithoutHours(timestamp: string) {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
    
        const date = new Date(parseInt(timestamp));
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
    
        return `${day} ${month} ${year}`;
    }

    formatJustDate(timestamp: string) {
        const date = new Date(parseInt(timestamp));
        const day = date.getDate();
        const month = date.getMonth()+1;
        const year = date.getFullYear();
    
        return `${day} / ${month} / ${year}`;
    }

    formatBalance(balance: number) {
        return balance.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 })
    }
}

export default utils;