import StreamContent from "./StreamContent";

export default function MainContent ({materials, isLoading}) {
    return (
        <div className="col-lg-9">
            <StreamContent materials={materials} isLoading = {isLoading}/>
        </div>
    );
};