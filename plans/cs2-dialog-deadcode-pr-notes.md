# CS-2 Dialog Dead-Code PR Notes

- PR body: `RemoveScroll enabled={open && modal}` is a behavior fix, not a no-op sweep; non-modal dialogs no longer lock page scroll, matching Radix semantics.
- Migration notes: removing DialogContentFrame's no-op `size` variant narrows the public `Dialog.Content` prop type; there were zero in-repo usages.
