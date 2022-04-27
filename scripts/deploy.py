from brownie import ProductTracking, accounts 


def main():
    """ Simple deploy script for our two contracts. """
    accounts[0].deploy(ProductTracking)
    