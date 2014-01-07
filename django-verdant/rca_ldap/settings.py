# http://stackoverflow.com/questions/7716562/pythonldapssl
import ldap
from django_auth_ldap.config import LDAPSearchUnion
from rca_ldap.config import LDAPSearchRCA

ldap.set_option(ldap.OPT_X_TLS_REQUIRE_CERT, ldap.OPT_X_TLS_NEVER)

AUTH_LDAP_CONNECTION_OPTIONS = {
    ldap.OPT_REFERRALS: 0,
    ldap.OPT_PROTOCOL_VERSION: 3,
    ldap.OPT_X_TLS: ldap.OPT_X_TLS_DEMAND,
    ldap.OPT_X_TLS_DEMAND: True,
    ldap.OPT_DEBUG_LEVEL: 255,
}

AUTH_LDAP_USER_ATTR_MAP = {
    "first_name": "givenName",
    "last_name": "sn",
    "email": "mail",
}

# Filter strings
def get_filter_string(base, **kwargs):
    filter_string = base

    for field, value in kwargs.items():
        filter_string = ''.join([
            '(&',
                filter_string,
                '(', field, '=', value, ')',
            ')'
        ])

    return filter_string

FILTER_BASE = '(sAMAccountName=%(user)s)'
FILTER_SUPER_PUBLISHERS = get_filter_string(FILTER_BASE, memberOf='CN=CMS Super-Publishers,OU=Media Relations & Marketing,OU=Administration,OU=Staff,DC=rca,DC=ac,DC=uk')
FILTER_PUBLISHERS = get_filter_string(FILTER_BASE, memberOf='CN=CMS Publishers,OU=Media Relations & Marketing,OU=Administration,OU=Staff,DC=rca,DC=ac,DC=uk')
FILTER_CONTRIBUTERS = get_filter_string(FILTER_BASE, memberOf='CN=CMS Contributors,OU=Media Relations & Marketing,OU=Administration,OU=Staff,DC=rca,DC=ac,DC=uk')
FILTER_VISITORS = get_filter_string(FILTER_BASE, memberOf='CN=CMS Visitors,OU=Media Relations & Marketing,OU=Administration,OU=Staff,DC=rca,DC=ac,DC=uk')

# Roles
ROLE_ADMIN  = dict(superuser=True, groups=[])
ROLE_MOD    = dict(superuser=False, groups=['Moderators'])
ROLE_EDITOR = dict(superuser=False, groups=['Editors'])
ROLE_USER   = dict(superuser=False, groups=[])

# Distinguished names
STAFF_DN    = 'OU=Staff,DC=rca,DC=ac,DC=uk'
STUDENTS_DN = 'OU=Students,DC=rca,DC=ac,DC=uk'

# Search
AUTH_LDAP_USER_SEARCH = LDAPSearchUnion(
    # Staff
    LDAPSearchRCA(STAFF_DN, ldap.SCOPE_SUBTREE, FILTER_SUPER_PUBLISHERS, role=ROLE_ADMIN),
    LDAPSearchRCA(STAFF_DN, ldap.SCOPE_SUBTREE, FILTER_PUBLISHERS, role=ROLE_MOD),
    LDAPSearchRCA(STAFF_DN, ldap.SCOPE_SUBTREE, FILTER_CONTRIBUTERS, role=ROLE_EDITOR),
    #LDAPSearchRCA(STAFF_DN, ldap.SCOPE_SUBTREE, FILTER_VISITORS, role=ROLE_USER),

    # Students
    LDAPSearchRCA(STUDENTS_DN, ldap.SCOPE_SUBTREE, FILTER_BASE, role=ROLE_USER),
)