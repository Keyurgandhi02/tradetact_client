import { CheckIcon } from "@heroicons/react/20/solid";

function Pricing({ data, planHandler }) {
  return (
    <div className="relative isolate bg-transparent px-6 py-12 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <p className="mt-2 text-4xl font-bold tracking-tight text-black-dark-400 dark:text-whiten sm:text-5xl">
          Affordable Simple Pricing
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 dark:text-gray text-black-dark-400">
        20-Day Money-Back Guarantee. Try Risk Free.
      </p>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {data.map((subscription, subscriptionIdx) => (
          <div
            key={subscription?.id}
            className="rounded-xl p-8 mx-3 ring-1 ring-secondary dark:ring-none sm:p-10"
          >
            <h3
              id={subscription?.id}
              className="text-main_color text-lg font-bold leading-7"
            >
              {subscription?.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className="text-black-dark-400 dark:text-whiten text-5xl font-bold tracking-tight">
                {subscription.price}
              </span>
              <span className="text-black-dark-400 dark:text-gray text-base">
                /month
              </span>
            </p>
            <p className="text-black-dark-400 dark:text-whiten mt-6 text-base leading-7">
              {subscription?.desc}
            </p>
            <ul className="text-black-dark-400 dark:text-whiten mt-8 space-y-3 text-sm leading-6 sm:mt-10">
              {subscription.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className="text-blue-600 h-6 w-5 flex-none"
                  />
                  {feature}
                </li>
              ))}
            </ul>
            {subscription?.name !== "Free Plan" ? (
              <button
                onClick={() => planHandler(subscription)}
                aria-describedby={subscription.id}
                className="bg-main_color w-full text-white shadow-sm mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10"
              >
                Activate {subscription?.name}
              </button>
            ) : (
              <div className="text-center font-bold mt-13 text-main_red_color">
                <span>Currently You are using this plan!</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
