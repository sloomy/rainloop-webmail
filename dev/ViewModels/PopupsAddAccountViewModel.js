/* RainLoop Webmail (c) RainLoop Team | Licensed under CC BY-NC-SA 3.0 */

/**
 * @constructor
 * @extends KnoinAbstractViewModel
 */
function PopupsAddAccountViewModel()
{
	KnoinAbstractViewModel.call(this, 'Popups', 'PopupsAddAccount');

	this.email = ko.observable('');
	this.password = ko.observable('');

	this.emailError = ko.observable(false);
	this.passwordError = ko.observable(false);

	this.email.subscribe(function () {
		this.emailError(false);
	}, this);

	this.password.subscribe(function () {
		this.passwordError(false);
	}, this);

	this.submitRequest = ko.observable(false);
	this.submitError = ko.observable('');

	this.emailFocus = ko.observable(false);

	this.addAccountCommand = Utils.createCommand(this, function () {

		this.emailError('' === Utils.trim(this.email()));
		this.passwordError('' === Utils.trim(this.password()));

		if (this.emailError() || this.passwordError())
		{
			return false;
		}

		this.submitRequest(true);

		RL.remote().accountAdd(_.bind(function (sResult, oData) {

			this.submitRequest(false);
			if (Enums.StorageResultType.Success === sResult && oData && 'AccountAdd' === oData.Action)
			{
				if (oData.Result)
				{
					RL.accountsAndIdentities();
					this.cancelCommand();
				}
				else if (oData.ErrorCode)
				{
					this.submitError(Utils.getNotification(oData.ErrorCode));
				}
			}
			else
			{
				this.submitError(Utils.getNotification(Enums.Notification.UnknownError));
			}

		}, this), this.email(), '', this.password());

		return true;

	}, function () {
		return !this.submitRequest();
	});

	Knoin.constructorEnd(this);
}

Utils.extendAsViewModel('PopupsAddAccountViewModel', PopupsAddAccountViewModel);

PopupsAddAccountViewModel.prototype.clearPopup = function ()
{
	this.email('');
	this.password('');

	this.emailError(false);
	this.passwordError(false);

	this.submitRequest(false);
	this.submitError('');
};

PopupsAddAccountViewModel.prototype.onShow = function ()
{
	this.clearPopup();
};

PopupsAddAccountViewModel.prototype.onFocus = function ()
{
	this.emailFocus(true);
};
