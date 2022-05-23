export const isServiceAlreadySelected = (servicesSelected, service) => (
  servicesSelected.some((element) => element.name === service.name)
);

export const createPackageNamesList = (service) => service.package_items.map((el) => el.name);

export const doesServiceHasPackageIncluded = (service) => service.package_items.length;
