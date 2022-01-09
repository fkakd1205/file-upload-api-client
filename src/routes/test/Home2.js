import React, { useEffect, useState } from "react";

let initData = [
    {
        id:1,
        name:'aa'
    },
    {
        id:2,
        name:'bb'
    }
]


const Home2 = () => {
    // state = {
    //     images:[],
    //     loading:false
    // }

    const [data, setData] = useState(0);
    const [images, setImages] = useState(0);
    const [loading, setLoading] = useState(false);

    // componentDidmount()
    // componentDidUpdate()
    // componentUnount()

    useEffect(()=>{
// loading
    },[])
    
    useEffect(()=>{
        console.log('effect')
    },[])

    const __handleDataConnect = () =>{
        return {

        }
    }

    const __handleEventControl = () =>{
        return {

        }
    }
    return(
        <React.Fragment>
            {console.log(data)}
            <button type='button' onClick={()=>setData(data+1)}>button1</button>
            <button type='button' onClick={()=>setImages(images+1)}>button2</button>
            Home2
        </React.Fragment>
    );
}

export default Home2;