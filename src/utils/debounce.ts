// Debounce function adapted to TS
type Procedure = (...args: any[]) => void

type Options = {
    isImmediate: boolean
}

function debounce<F extends Procedure>(
    func: F,
    waitMilliseconds = 50,
    options: Options = { isImmediate: false }
): (this: ThisParameterType<F>, ...args: Parameters<F>) => void {
    let timeOutId: ReturnType<typeof setTimeout> | undefined

    return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
        const context = this

        const doLater = function () {
            timeOutId = undefined
            if (!options.isImmediate) {
                func.apply(context, args)
            }
        }

        const shouldCallNow = options.isImmediate && timeOutId === undefined

        if (timeOutId !== undefined) {
            clearTimeout(timeOutId)
        }

        timeOutId = setTimeout(doLater, waitMilliseconds)

        if (shouldCallNow) {
            func.apply(context, args)
        }
    }
}

export { debounce }
