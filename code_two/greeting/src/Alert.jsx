function Alert({type, message}) {
    const alertClass = type === 'error' ? 'alert-error' : 'alert-success';

    return <div className={alertClass}>{message}</div>
}

export default Alert;