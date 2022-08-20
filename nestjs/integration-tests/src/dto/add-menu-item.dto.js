export class AddMenuItemDto {
  constructor(menuItemId, menuItemShortName, howMany) {
    this.menuItemId = menuItemId;
    this.menuItemShortName = menuItemShortName;
    this.howMany = howMany;
  }
}
