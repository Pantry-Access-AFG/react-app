import Request from './components/Request';
import RequestsHeader from './components/RequestsHeader';
export default function MyRequests() { 
    return (
        <div style={{marginLeft: "16px", marginRight: "16px"}}>
            <RequestsHeader/>
            <Request/>
        </div>
    )
}